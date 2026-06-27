---
title: "Node.js Runtime Internals"
layout: base.njk
category: Backend
tags: [nodejs, runtime, event-loop, v8, study-plan, interview]
---

Trilha #4 do [[study-plan-gaps|plano de estudos]]. Como o Node.js realmente
executa o código por baixo dos panos.

## Event Loop (libuv)

Fases em ordem, por iteração (tick):

1. **timers** — callbacks de `setTimeout`/`setInterval`.
2. **pending callbacks** — alguns callbacks de I/O adiados.
3. **idle/prepare** — interno.
4. **poll** — busca novos eventos de I/O; executa callbacks de I/O.
5. **check** — callbacks de `setImmediate`.
6. **close callbacks** — ex.: `socket.on('close')`.

- **Microtasks** rodam _entre_ fases e esvaziam completamente: `process.nextTick`
  (fila própria, prioridade máxima) e depois **Promises** (`then/catch/finally`).
- `setImmediate` (check) vs `setTimeout(0)` (timers): a ordem depende do contexto;
  dentro de um callback de I/O, `setImmediate` roda primeiro.

```js
console.log("1");
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
console.log("2");
// 1, 2, nextTick, promise, (timeout/immediate conforme contexto)
```

## libuv & thread pool

- Node é single-threaded para JS, mas o **libuv** usa um **thread pool**
  (padrão 4, `UV_THREADPOOL_SIZE`) para: fs, DNS (`dns.lookup`), `crypto.pbkdf2`,
  `zlib`.
- Bloquear o event loop (loop pesado de CPU, `*Sync`) trava **todas** as conexões.
  Offload para `worker_threads` ou fila (ver [[nodejs-high-concurrency]]).

## V8

- **Call stack** + **heap**; **GC geracional** (new space / old space),
  scavenge vs mark-sweep-compact.
- **Hidden classes / inline caches** — manter shape dos objetos estável ajuda o JIT.
- Flags úteis: `--max-old-space-size`, `--inspect` (DevTools), heap snapshots.

## Streams & backpressure

- `Readable`/`Writable`/`Transform`/`Duplex`; `pipe`/`pipeline`.
- **Backpressure**: `write()` retorna `false` → pare até o evento `drain`.
- Use streams para arquivos/respostas grandes e evitar estourar a memória.

## Concorrência & processos

- **`worker_threads`** — paralelismo de CPU, memória compartilhável (`SharedArrayBuffer`).
- **`cluster`** / PM2 — múltiplos processos compartilhando porta (escala em cores).
- **`child_process`** — spawn de processos externos.

## Diagnóstico de memória

- Vazamentos comuns: listeners não removidos, closures retendo refs, caches sem
  limite, timers órfãos.
- Ferramentas: `--inspect` + Chrome DevTools, heap snapshots, `clinic.js`,
  `--prof`.

## Perguntas de entrevista (treinar)

- Explique as fases do event loop. Onde entram microtasks?
- `process.nextTick` vs `setImmediate` vs `setTimeout(0)`?
- O que o thread pool do libuv processa?
- O que acontece se você bloquear o event loop? Como evitar?
- O que é backpressure em streams?

---

Relacionadas: [[nodejs-high-concurrency]] · [[express-middleware-chain]] ·
[[study-plan-gaps|plano de estudos]].
