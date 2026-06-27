---
title: "Trabalhar com Node + Express (modelo mental e estrutura)"
layout: base.njk
category: Backend
tags: [express, nodejs, backend, patterns]
---

Resumo de campo para montar e manter uma API com **Express** sem virar espaguete.
A ideia central: Express é um **roteador minimalista construído sobre uma pilha de
middlewares** — toda requisição percorre `app → router → middlewares → handler`, e
cada peça só chama `next()` ou responde. Para a _ordem_ dessa pilha, ver
[[express-middleware-chain|cadeia de middlewares]]; aqui é o fluxo de trabalho ao redor.

## O modelo mental: req → middlewares → res

Cada middleware é uma função `(req, res, next)`. Ele faz seu pedaço e:

- chama `next()` para passar adiante,
- ou responde (`res.json()`) e **encerra** a cadeia,
- ou chama `next(err)` para pular direto ao error handler.

```ts
import express, { Request, Response, NextFunction } from "express";
const app = express();

app.use(express.json()); // parseia o body JSON em todas as rotas.

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" }); // encerra a cadeia aqui.
});
```

⚠️ Esquecer `next()` (sem responder) **trava** a requisição: o cliente fica pendurado.

## Estrutura de projeto: por camada

Separe responsabilidades para a base crescer sem acoplar tudo no arquivo de rota:

```
src/
  routes/      # define endpoints e amarra middlewares (fino).
  controllers/ # lê req, chama o service, formata a res.
  services/    # regra de negócio pura (sem conhecer Express).
  middlewares/ # auth, validação, rate limit — reutilizáveis.
  app.ts       # monta os middlewares globais e os routers.
```

- **Router por recurso:** `express.Router()` agrupa rotas e mantém `app.ts` enxuto.
- ⚠️ Mantenha o **service sem `req`/`res`** — assim ele é testável e reusável fora do HTTP.

```ts
// routes/orders.ts
import { Router } from "express";
const router = Router();
router.get("/", listOrders); // controller, não a lógica inline.
export default router;

// app.ts
app.use("/api/orders", router); // prefixo montado uma vez.
```

## Async e tratamento de erros

Em handlers `async`, uma `Promise` rejeitada **não** é capturada automaticamente
(no Express 4) — você precisa encaminhá-la ao error handler.

```ts
// Wrapper que captura rejeições e chama next(err).
const wrap =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const order = await db.findOrder(req.params.id); // pode lançar.
    res.json(order);
  }),
);

// Error handler: SEMPRE 4 argumentos e por último na cadeia.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message });
});
```

- ✅ **Express 5** já encaminha rejeições de handlers async automaticamente — o `wrap`
  vira opcional. Em projetos no 4.x, padronize o wrapper (ou use `express-async-errors`).

## Tabela de referência rápida

| Quero...                       | Uso                                           |
| :----------------------------- | :-------------------------------------------- |
| Aplicar algo a todas as rotas  | `app.use(mw)`                                 |
| Agrupar rotas de um recurso    | `express.Router()` + `app.use(prefixo, r)`    |
| Parsear JSON do body           | `express.json()`                              |
| Capturar erro de handler async | wrapper `.catch(next)` (ou Express 5)         |
| Tratar todos os erros          | middleware de **4 args**, por último          |
| Validar entrada                | `zod` / `Joi` num middleware antes do handler |

## Armadilhas comuns

- **Ordem importa:** body parser e auth antes das rotas que dependem deles — ver
  [[express-middleware-chain|ordem dos middlewares]].
- **Não bloqueie o event loop** com trabalho de CPU dentro do handler — ver
  [[nodejs-high-concurrency|alta concorrência]].
- **Sempre** valide e sanitize `req.body`/`req.params` antes de usar.
- **Helmet + CORS** desde o primeiro commit; segurança não é refactor de depois.

## Referências e ferramentas

- **express** — o framework; minimalista de propósito.
- **zod** — validação de schema tipada para body/query/params.
- **helmet** — headers de segurança HTTP em uma linha.
- **morgan** — logging de requisições para dev.

---

Relacionadas: [[express-middleware-chain|cadeia de middlewares]] ·
[[nodejs-high-concurrency|alta concorrência]] · [[typeScript-patterns|padrões TypeScript]].
