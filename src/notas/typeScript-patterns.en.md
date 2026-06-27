---
title: "Advanced TypeScript Patterns"
layout: base.njk
category: Frontend
tags: [typescript, patterns, study-plan, interview]
---

In-depth companion to track #1 of the [[study-plan-gaps|study plan]], focused on
**advanced typing**. For React composition patterns, see [[advanced-react]].

## 🧱 1. Structural Type Patterns

### 1.1 Discriminated Unions

Used to model mutually exclusive states safely.

```typescript
type LoadingState = { status: "loading" };
type SuccessState<T> = { status: "success"; data: T };
type ErrorState = { status: "error"; error: Error };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

// Usage with automatic type narrowing
function handleState<T>(state: AsyncState<T>) {
  if (state.status === "loading") {
    console.log("Loading...");
  } else if (state.status === "success") {
    console.log(state.data); // T available
  } else {
    console.log(state.error.message);
  }
}
```

### 1.2 Branded / Opaque Types

Create types that are structurally identical but semantically distinct, avoiding
confusion between IDs.

```typescript
type UserId = string & { readonly __brand: unique symbol };
type ProductId = string & { readonly __brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) {
  /* ... */
}

// getUser(createProductId('123')); // Type error!
```

### 1.3 Satisfies Operator

Validates the type of an expression without widening it (keeps the most specific
inference).

```typescript
const config = {
  port: 3000,
  env: "production",
  logLevel: "info",
} satisfies Record<string, string | number>;

// config.port is `number`, not `string | number`
// config.env is `'production'`, not `string`
```

---

## 🧩 2. Type Manipulation Patterns

### 2.1 Conditional Types with `infer`

Extract types from within other types. Useful for advanced utilities.

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Result = UnwrapPromise<Promise<string>>; // string

type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Fn = (x: number) => string;
type R = GetReturnType<Fn>; // string
```

### 2.2 Mapped Types with Modifiers (`+?`, `-?`, `readonly`)

Create new types from existing keys.

```typescript
// Make all properties optional and readonly
type PartialReadonly<T> = {
  readonly [K in keyof T]?: T[K];
};

// Remove readonly from all properties
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Pick by value type (e.g. take only strings)
type PickStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

### 2.3 Template Literal Types

Create types based on strings, perfect for routes, events and the DOM.

```typescript
type EventType = "click" | "hover" | "focus";
type HandlerName = `on${Capitalize<EventType>}`; // 'onClick' | 'onHover' | 'onFocus'

// Route validation with parameters
type Route = `/user/${string}/post/${string}`;
const route: Route = "/user/123/post/456"; // OK
```

### 2.4 Variadic Tuple Types

Allow manipulating tuples of variable length, essential for function composition.

```typescript
// Concatenate tuples
type Concat<T extends any[], U extends any[]> = [...T, ...U];
type Result = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]

// Function that receives and spreads arguments
declare function spread<T extends any[]>(...args: T): T;
const arr = spread(1, "a", true); // type: [number, string, boolean]
```

---

## 🏗️ 3. Classic Design Patterns with TypeScript

### 3.1 Factory Pattern with Generics

Creates instances with automatic inferred typing.

```typescript
interface Product {
  id: string;
  name: string;
}

class ProductFactory {
  create<T extends Product>(type: new () => T): T {
    return new type();
  }
}

class Book implements Product {
  id = "b1";
  name = "Book";
  author = "Unknown";
}

const factory = new ProductFactory();
const book = factory.create(Book); // type: Book (with author available)
```

### 3.2 Builder Pattern with Typed State

Ensures methods are called in the correct order via states.

```typescript
interface Step1 {
  setA(value: string): Step2;
}
interface Step2 {
  setB(value: number): Final;
}
interface Final {
  build(): { a: string; b: number };
}

class Builder implements Step1, Step2, Final {
  private a = "";
  private b = 0;
  setA(value: string) {
    this.a = value;
    return this;
  }
  setB(value: number) {
    this.b = value;
    return this;
  }
  build() {
    return { a: this.a, b: this.b };
  }
}

const result = new Builder().setA("test").setB(10).build();
```

### 3.3 Adapter Pattern with Type Mapping

Adapts external data (API) to the internal domain with validation.

```typescript
interface ApiUser {
  user_id: string;
  full_name: string;
  age_str: string;
}

interface DomainUser {
  id: string;
  name: string;
  age: number;
}

function adaptUser(api: ApiUser): DomainUser {
  return {
    id: api.user_id,
    name: api.full_name,
    age: parseInt(api.age_str, 10),
  };
}
// Use with `satisfies` to ensure the adapter covers all keys
```

---

## 🧪 4. Patterns for Functionality and Utilities

### 4.1 Result / Either Pattern (Error Handling)

Represents operations that can fail without throwing exceptions.

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function safeParse<T>(json: string): Result<T> {
  try {
    return { ok: true, value: JSON.parse(json) };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

const res = safeParse<{ id: number }>('{"id":1}');
if (res.ok) console.log(res.value.id);
```

### 4.2 Typed Curry with Variadic Tuples

Function that turns `(a, b, c) => R` into `(a) => (b) => (c) => R`.

```typescript
type Curry<P extends any[], R> = P extends [infer First, ...infer Rest]
  ? (arg: First) => Curry<Rest, R>
  : R;

declare function curried<A extends any[], R>(fn: (...args: A) => R): Curry<A, R>;

const sum = (a: number, b: number, c: number) => a + b + c;
const curriedSum = curried(sum);
const result = curriedSum(1)(2)(3); // 6
```

### 4.3 Registry Pattern (Service Registry)

Keeps a map of constructors or functions with typed keys via `Record`.

```typescript
interface ServiceMap {
  user: { getName(): string };
  product: { getPrice(): number };
}

class ServiceRegistry {
  private services: Partial<Record<keyof ServiceMap, ServiceMap[keyof ServiceMap]>> =
    {};

  register<K extends keyof ServiceMap>(key: K, service: ServiceMap[K]) {
    this.services[key] = service;
  }

  get<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
    if (!this.services[key]) throw new Error("Service not found");
    return this.services[key] as ServiceMap[K];
  }
}
```

---

## 🔌 5. Declaration and Module Patterns

### 5.1 Module Augmentation

Extends third-party or global definitions.

```typescript
// Augmenting the global Array
declare global {
  interface Array<T> {
    last(): T | undefined;
  }
}

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}
```

### 5.2 Declaration Merging

Combines multiple declarations of the same interface/namespace.

```typescript
interface Config {
  port: number;
}
interface Config {
  host: string;
}
// Result: Config { port: number; host: string; }

// Useful for libraries with plugins
namespace Validation {
  export interface Validator {}
}
namespace Validation {
  export interface EmailValidator extends Validator {}
}
```

---

## 🎯 6. Patterns for Hooks and React (Intersection)

Although the focus is pure TypeScript, these patterns are crucial in the React
ecosystem:

### 6.1 Typing Custom Hooks with Overloads

```typescript
function useState<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void];
function useState<T = undefined>(): [T | undefined, (v: T | ((prev: T) => T)) => void];
// Implementation...
```

### 6.2 Higher-Order Components (HOC) with Prop Injection

```typescript
type WithAuthProps = { isAuthenticated: boolean };

function withAuth<P extends WithAuthProps>(
  Component: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof WithAuthProps>> {
  return function Wrapped(props: Omit<P, keyof WithAuthProps>) {
    const auth = { isAuthenticated: true };
    return <Component {...(props as P)} {...auth} />;
  };
}
```

---

## 📋 Checklist for Senior Interviews

| Question                                                                                | Pattern/Concept covered                               |
| :-------------------------------------------------------------------------------------- | :---------------------------------------------------- |
| _"How would you build an event system where the event name dictates the payload type?"_ | Template Literals + Mapped Types (e.g. `EventMap[K]`) |
| _"How do you avoid mixing IDs of different entities?"_                                  | Branded Types / Opaque Types                          |
| _"How do you create a utility that extracts the return type of an async function?"_     | `Awaited<ReturnType<T>>` + Conditional Types          |
| _"How would you implement a safe Redux reducer without `any`?"_                         | Discriminated Unions for actions (`type` + `payload`) |
| _"How do you ensure a config object has all keys of an enum, but allows extra values?"_ | `Record<Enum, T> & Partial<Record<string, unknown>>`  |
| _"How do you type a `compose` of functions with a variable number of arguments?"_       | Variadic Tuple Types + recursive `infer`              |

---

## 🧠 Final Practical Challenge

**Build a `createApiClient` function that:**

1. Takes a base URL and an object of endpoints.
2. Each endpoint has a method (GET/POST) and a path with parameters (e.g. `/users/:id`).
3. Returns a client where each endpoint is a method that accepts the parameters and the body (if POST) and returns a typed Promise.
4. Use **Template Literal Types** to extract the path parameters.
5. Use **Conditional Types** to require the body only for POST.

---

## 📚 References and Tools

- `ts-reset` – Fixes problematic native types.
- `zod` – Runtime validation with static type inference.
- `type-fest` – Collection of advanced utility types (e.g. `OmitIndexSignature`, `DelimiterCasedProperties`).
- ESLint: `@typescript-eslint/consistent-type-imports` – Enforces `import type` for better bundling.

---

> **Conclusion:** Mastering these patterns is not just about writing types, but about **modeling domains, preventing bugs at compile time and creating intuitive APIs**. The true power of TypeScript emerges when types guide the implementation, not just document it.

---

Related: [[advanced-react]] · [[study-plan-gaps|study plan]].
