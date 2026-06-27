---
title: "Node.js Runtime Internals"
layout: base.njk
category: Backend
tags: [nodejs, runtime, event-loop, v8, study-plan, interview]
---

Track #4 of the [[study-plan-gaps|study plan]]. How Node.js actually runs your
code under the hood.

## Event Loop (libuv)

Phases in order, per iteration (tick):

1. **timers** — callbacks of `setTimeout`/`setInterval`.
2. **pending callbacks** — some deferred I/O callbacks.
3. **idle/prepare** — internal.
4. **poll** — fetches new I/O events; runs I/O callbacks.
5. **check** — `setImmediate` callbacks.
6. **close callbacks** — e.g. `socket.on('close')`.

- **Microtasks** run _between_ phases and fully drain: `process.nextTick`
  (own queue, top priority) and then **Promises** (`then/catch/finally`).
- `setImmediate` (check) vs `setTimeout(0)` (timers): the order depends on
  context; inside an I/O callback, `setImmediate` runs first.

```js
console.log("1");
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
console.log("2");
// 1, 2, nextTick, promise, (timeout/immediate depending on context)
```

## libuv & thread pool

- Node is single-threaded for JS, but **libuv** uses a **thread pool**
  (default 4, `UV_THREADPOOL_SIZE`) for: fs, DNS (`dns.lookup`), `crypto.pbkdf2`,
  `zlib`.
- Blocking the event loop (heavy CPU loop, `*Sync`) freezes **all** connections.
  Offload to `worker_threads` or a queue (see [[nodejs-high-concurrency]]).

## V8

- **Call stack** + **heap**; **generational GC** (new space / old space),
  scavenge vs mark-sweep-compact.
- **Hidden classes / inline caches** — keeping object shape stable helps the JIT.
- Useful flags: `--max-old-space-size`, `--inspect` (DevTools), heap snapshots.

## Streams & backpressure

- `Readable`/`Writable`/`Transform`/`Duplex`; `pipe`/`pipeline`.
- **Backpressure**: `write()` returns `false` → stop until the `drain` event.
- Use streams for large files/responses to avoid blowing up memory.

## Concurrency & processes

- **`worker_threads`** — CPU parallelism, shareable memory (`SharedArrayBuffer`).
- **`cluster`** / PM2 — multiple processes sharing a port (scales over cores).
- **`child_process`** — spawning external processes.

## Memory diagnostics

- Common leaks: unremoved listeners, closures holding refs, unbounded caches,
  orphan timers.
- Tools: `--inspect` + Chrome DevTools, heap snapshots, `clinic.js`, `--prof`.

## Interview questions (practice)

- Explain the event loop phases. Where do microtasks fit in?
- `process.nextTick` vs `setImmediate` vs `setTimeout(0)`?
- What does the libuv thread pool process?
- What happens if you block the event loop? How do you avoid it?
- What is backpressure in streams?

---

Related: [[nodejs-high-concurrency]] · [[express-middleware-chain]] ·
[[study-plan-gaps|study plan]].
