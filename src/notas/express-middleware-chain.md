---
title: "Cadeia de Middlewares no Express (auth, rate limit, validação)"
layout: base.njk
category: Backend
tags: [express, nodejs, backend, interview]
---

Nota de [[nix-interview-prep|preparação para a N-iX]] — camada HTTP do backend.

**Resumo:** a ordem importa. Estruturo do **mais amplo / mais barato** para o
**mais específico / mais caro**.

## Ordem correta

1. **Logging / Request ID** – adiciona `req.id` para tracing.
2. **CORS / Helmet** – headers de segurança primeiro.
3. **Body parsers** – `express.json()`, `express.urlencoded()`.
4. **Rate limiter** – `express-rate-limit` por IP ou user ID.
5. **Autenticação** – valida o token JWT / OAuth. Bloqueia cedo se inválido.
6. **Autorização** – checa permissões (ex.: `req.user.role === 'admin'`).
7. **Validação** – `Joi` / `zod` para validar body/query da requisição.
8. **Route handler** – a lógica de negócio em si.
9. **Error handler** – captura todos os erros e responde o status HTTP adequado.

```ts
app.use(logger);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(authMiddleware);
app.use(authorizationMiddleware);
app.use(validateRequest);
app.use("/api/orders", orderRoutes);
app.use(errorHandler);
```

## Por que esta ordem

- Rate limiting antes da auth evita gastar CPU com tokens inválidos.
- Auth antes da validação evita validar requisições de usuários não autenticados.
- O error handler vem por último para capturar qualquer erro lançado.

**Nota do mundo real:** também adiciono **circuit breakers** em chamadas a APIs
externas dentro do route handler para evitar falhas em cascata.

---

Relacionadas: [[nodejs-high-concurrency|Node.js sob alta concorrência]] ·
[[nix-interview-prep|índice]].
