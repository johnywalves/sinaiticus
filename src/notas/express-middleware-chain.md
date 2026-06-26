---
title: "Cadeia de Middlewares no Express (auth, rate limit, validação)"
layout: base.njk
category: Backend
tags: [express, nodejs, backend, interview]
---

**Summary:** Order matters. I structure from **most broad / least expensive** to
**most specific / expensive**.

## Correct order
1. **Logging / Request ID** – adds `req.id` for tracing.
2. **CORS / Helmet** – security headers first.
3. **Body parsers** – `express.json()`, `express.urlencoded()`.
4. **Rate limiter** – `express-rate-limit` based on IP or user ID.
5. **Authentication** – validates JWT / OAuth token. Blocks early if invalid.
6. **Authorization** – checks permissions (e.g., `req.user.role === 'admin'`).
7. **Validation** – `Joi` / `zod` to validate request body/query.
8. **Route handler** – the actual business logic.
9. **Error handler** – catches all errors and sends appropriate HTTP status.

```ts
app.use(logger);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(authMiddleware);
app.use(authorizationMiddleware);
app.use(validateRequest);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);
```

## Why this order
- Rate limiting before auth avoids wasting CPU on invalid tokens.
- Auth before validation prevents validating requests from unauthenticated users.
- Error handler is last to catch any thrown errors.

**Real-world note:** I also add **circuit breakers** on external API calls inside
the route handler to prevent cascading failures.

---
Relacionadas: [[nodejs-high-concurrency|Node.js sob alta concorrência]] ·
[[nix-interview-prep|índice]].
