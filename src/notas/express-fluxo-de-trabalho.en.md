---
title: "Working with Node + Express (mental model and structure)"
layout: base.njk
category: Backend
tags: [express, nodejs, backend, patterns]
---

A field summary for building and maintaining an **Express** API without it turning into
spaghetti. The core idea: Express is a **minimalist router built on a stack of
middlewares** — every request flows `app → router → middlewares → handler`, and each
piece either calls `next()` or responds. For the _ordering_ of that stack, see the
[[express-middleware-chain|middleware chain]]; this note is the workflow around it.

## The mental model: req → middlewares → res

Each middleware is a `(req, res, next)` function. It does its bit and then:

- calls `next()` to pass it along,
- or responds (`res.json()`) and **ends** the chain,
- or calls `next(err)` to jump straight to the error handler.

```ts
import express, { Request, Response, NextFunction } from "express";
const app = express();

app.use(express.json()); // parses the JSON body on every route.

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" }); // ends the chain here.
});
```

⚠️ Forgetting `next()` (without responding) **hangs** the request: the client waits forever.

## Project structure: by layer

Split responsibilities so the codebase grows without coupling everything into the route file:

```
src/
  routes/      # defines endpoints and wires middlewares (thin).
  controllers/ # reads req, calls the service, formats the res.
  services/    # pure business logic (knows nothing about Express).
  middlewares/ # auth, validation, rate limit — reusable.
  app.ts       # mounts global middlewares and routers.
```

- **Router per resource:** `express.Router()` groups routes and keeps `app.ts` lean.
- ⚠️ Keep the **service free of `req`/`res`** — that makes it testable and reusable outside HTTP.

```ts
// routes/orders.ts
import { Router } from "express";
const router = Router();
router.get("/", listOrders); // a controller, not inline logic.
export default router;

// app.ts
app.use("/api/orders", router); // prefix mounted once.
```

## Async and error handling

In `async` handlers, a rejected `Promise` is **not** caught automatically (in Express 4)
— you have to forward it to the error handler.

```ts
// Wrapper that catches rejections and calls next(err).
const wrap =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/:id",
  wrap(async (req, res) => {
    const order = await db.findOrder(req.params.id); // may throw.
    res.json(order);
  }),
);

// Error handler: ALWAYS 4 arguments and last in the chain.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message });
});
```

- ✅ **Express 5** already forwards async handler rejections automatically — the `wrap`
  becomes optional. On 4.x projects, standardize the wrapper (or use `express-async-errors`).

## Quick reference table

| I want to...                  | Use                                          |
| :---------------------------- | :------------------------------------------- |
| Apply something to all routes | `app.use(mw)`                                |
| Group a resource's routes     | `express.Router()` + `app.use(prefix, r)`    |
| Parse the JSON body           | `express.json()`                             |
| Catch an async handler error  | `.catch(next)` wrapper (or Express 5)        |
| Handle all errors             | a **4-arg** middleware, placed last          |
| Validate input                | `zod` / `Joi` in a middleware before handler |

## Common pitfalls

- **Order matters:** body parser and auth before the routes that depend on them — see
  the [[express-middleware-chain|middleware ordering]].
- **Don't block the event loop** with CPU work inside the handler — see
  [[nodejs-high-concurrency|high concurrency]].
- **Always** validate and sanitize `req.body`/`req.params` before using them.
- **Helmet + CORS** from the first commit; security isn't a later refactor.

## References and tools

- **express** — the framework; minimalist by design.
- **zod** — typed schema validation for body/query/params.
- **helmet** — HTTP security headers in one line.
- **morgan** — request logging for dev.

---

Related: [[express-middleware-chain|middleware chain]] ·
[[nodejs-high-concurrency|high concurrency]] · [[typeScript-patterns|TypeScript patterns]].
