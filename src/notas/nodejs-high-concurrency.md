---
title: "Endpoint Node.js Responsivo sob Alta Concorrência"
layout: base.njk
category: Backend
tags: [nodejs, performance, backend, interview]
---

Nota de [[nix-interview-prep|preparação para a N-iX]] — performance de backend.

**Resumo:** use **padrões async não-bloqueantes**, **descarregue tarefas de CPU**
e **escale horizontalmente**.

## Estratégias-chave

1. **I/O assíncrono não-bloqueante:**
   - Use `async/await` para todo I/O (DB, APIs externas, sistema de arquivos).
   - Evite funções `Sync` (`readFileSync`, `crypto.pbkdf2Sync`).
   - Use **streams** para dados grandes (export CSV) e não bufferizar na memória.
2. **Tarefas intensivas em CPU:**
   - Mova-as para **Worker Threads** ou um **microsserviço separado**.
   - Use `worker_threads` ou uma fila externa (Bull + Redis).
   - Responda imediatamente com `202 Accepted` e processe em background.
3. **Connection Pooling:**
   - Para PostgreSQL, use `pg.Pool` com um máximo de conexões configurado.
   - Mantenha o pool abaixo do máximo do banco para evitar timeouts.
4. **Rate Limiting & Backpressure:**
   - Aplique rate limiting (por IP/usuário) — ver [[express-middleware-chain|ordem dos middlewares]].
   - Use sinais de backpressure para frear clientes quando sobrecarregado.
5. **Escala horizontal:**
   - Rode múltiplas instâncias Node (cluster mode ou PM2).
   - Use um load balancer (NGINX) para distribuir as requisições.
   - Garanta **statelessness** para qualquer instância atender qualquer request.
6. **Monitoramento & Observabilidade:**
   - Métricas (req/s, taxa de erro, latência) via Prometheus.
   - Tracing distribuído (OpenTelemetry) para localizar gargalos.

```ts
app.post("/api/report", async (req, res) => {
  const { data } = req.body;
  const job = await queue.add("generate-report", { data });
  res.status(202).json({ jobId: job.id }); // resposta imediata
});
```

## Resultado real (Seguralta)

Usado em relatórios mensais de comissão. O endpoint suportou **2.500 requisições
concorrentes** sem bloquear o event loop, com tempo de resposta médio < 200ms para
o `202 Accepted` inicial.

---

Relacionadas: [[express-middleware-chain|cadeia de middlewares]] ·
[[nix-interview-prep|índice]].
