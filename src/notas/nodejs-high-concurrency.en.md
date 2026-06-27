---
title: "Responsive Node.js Endpoint Under High Concurrency"
layout: base.njk
category: Backend
tags: [nodejs, performance, backend, interview]
---

Note from the [[nix-interview-prep|N-iX interview prep]] — backend performance.

**Summary:** Use **non-blocking async patterns**, **offload CPU tasks**, and
**scale horizontally**.

## Key strategies

1. **Non-blocking Async I/O:**
   - Use `async/await` for all I/O (DB, external APIs, file system).
   - Avoid `Sync` functions (`readFileSync`, `crypto.pbkdf2Sync`).
   - Use **streams** for large data (CSV exports) to avoid buffering in memory.
2. **CPU-intensive tasks:**
   - Move them to **Worker Threads** or a **separate microservice**.
   - Use `worker_threads` or an external job queue (Bull + Redis).
   - Respond immediately with `202 Accepted` and process in the background.
3. **Connection Pooling:**
   - For PostgreSQL, use `pg.Pool` with a configured max connections.
   - Keep the pool size below the DB's max to avoid timeouts.
4. **Rate Limiting & Backpressure:**
   - Apply rate limiting (per IP/user) — see [[express-middleware-chain|middleware order]].
   - Use backpressure signals to slow down clients when overloaded.
5. **Horizontal scaling:**
   - Run multiple Node instances (cluster mode or PM2).
   - Use a load balancer (NGINX) to distribute requests.
   - Ensure **statelessness** so any instance can handle any request.
6. **Monitoring & Observability:**
   - Metrics (req/sec, error rate, latency) via Prometheus.
   - Distributed tracing (OpenTelemetry) to pinpoint bottlenecks.

```ts
app.post("/api/report", async (req, res) => {
  const { data } = req.body;
  const job = await queue.add("generate-report", { data });
  res.status(202).json({ jobId: job.id }); // immediate response
});
```

## Real-world result (Seguralta)

Used for monthly commission reports. The endpoint handled **2,500 concurrent
requests** without blocking the event loop, with average response time < 200ms for
the initial `202 Accepted`.

---

Related: [[express-middleware-chain|middleware chain]] ·
[[nix-interview-prep|index]].
