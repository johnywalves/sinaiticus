---
title: "Advanced React & TypeScript Patterns"
layout: base.njk
category: Frontend
tags: [typescript, patterns, study-plan, interview]
---

## 🧱 1. Padrões de Tipagem Estrutural (Structural Type Patterns)

### 1.1 Discriminated Unions (Uniões Discriminadas)

Usado para modelar estados mutuamente exclusivos com segurança.

```typescript
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: Error };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

// Uso com type narrowing automático
function handleState<T>(state: AsyncState<T>) {
  if (state.status === 'loading') {
    console.log('Carregando...');
  } else if (state.status === 'success') {
    console.log(state.data); // T disponível
  } else {
    console.log(state.error.message);
  }
}
```

### 1.2 Branded / Opaque Types (Tipos Nominais)

Criam tipos que são estruturalmente idênticos, mas semanticamente distintos, evitando confusões entre IDs.

```typescript
type UserId = string & { readonly __brand: unique symbol };
type ProductId = string & { readonly __brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId) { /* ... */ }

// getUser(createProductId('123')); // Erro de tipo!
```

### 1.3 Satisfies Operator

Valida o tipo de uma expressão sem alargá-lo (mantém a inferência mais específica).

```typescript
const config = {
  port: 3000,
  env: 'production',
  logLevel: 'info'
} satisfies Record<string, string | number>;

// config.port é `number`, não `string | number`
// config.env é `'production'`, não `string`
```

---

## 🧩 2. Padrões de Manipulação de Tipos (Type Manipulation Patterns)

### 2.1 Conditional Types com `infer`

Extraem tipos de dentro de outros tipos. Útil para utilitários avançados.

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type Result = UnwrapPromise<Promise<string>>; // string

type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Fn = (x: number) => string;
type R = GetReturnType<Fn>; // string
```

### 2.2 Mapped Types com Modificadores (`+?`, `-?`, `readonly`)

Criam novos tipos a partir de chaves existentes.

```typescript
// Tornar todas as propriedades opcionais e readonly
type PartialReadonly<T> = {
  readonly [K in keyof T]?: T[K];
};

// Remover o readonly de todas as propriedades
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Pick por tipo de valor (ex: pegar apenas strings)
type PickStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

### 2.3 Template Literal Types

Criam tipos baseados em strings, perfeitos para rotas, eventos e DOM.

```typescript
type EventType = 'click' | 'hover' | 'focus';
type HandlerName = `on${Capitalize<EventType>}`; // 'onClick' | 'onHover' | 'onFocus'

// Validação de rotas com parâmetros
type Route = `/user/${string}/post/${string}`;
const route: Route = '/user/123/post/456'; // OK
```

### 2.4 Variadic Tuple Types

Permitem manipular tuplas de tamanho variável, essencial para composição de funções.

```typescript
// Concatenar tuplas
type Concat<T extends any[], U extends any[]> = [...T, ...U];
type Result = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]

// Função que recebe e espalha argumentos
declare function spread<T extends any[]>(...args: T): T;
const arr = spread(1, 'a', true); // tipo: [number, string, boolean]
```

---

## 🏗️ 3. Design Patterns Clássicos com TypeScript

### 3.1 Factory Pattern (Fábrica) com Generics

Cria instâncias com tipagem inferida automática.

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
  id = 'b1';
  name = 'Book';
  author = 'Unknown';
}

const factory = new ProductFactory();
const book = factory.create(Book); // tipo: Book (com author disponível)
```

### 3.2 Builder Pattern (Construtor) com Estado Tipado

Garante que métodos sejam chamados na ordem correta via estados.

```typescript
interface Step1 { setA(value: string): Step2; }
interface Step2 { setB(value: number): Final; }
interface Final { build(): { a: string; b: number }; }

class Builder implements Step1, Step2, Final {
  private a = '';
  private b = 0;
  setA(value: string) { this.a = value; return this; }
  setB(value: number) { this.b = value; return this; }
  build() { return { a: this.a, b: this.b }; }
}

const result = new Builder().setA('test').setB(10).build();
```

### 3.3 Adapter Pattern (Adaptador) com Mapeamento de Tipos

Adapta dados externos (API) para o domínio interno com validação.

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
    age: parseInt(api.age_str, 10)
  };
}
// Uso com `satisfies` para garantir que o adaptador cobre todas as chaves
```

---

## 🧪 4. Padrões para Funcionalidade e Utilitários

### 4.1 Result / Either Pattern (Tratamento de Erros)

Representa operações que podem falhar sem lançar exceções.

```typescript
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

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

### 4.2 Curry (Currying) Tipado com Variadic Tuples

Função que transforma `(a, b, c) => R` em `(a) => (b) => (c) => R`.

```typescript
type Curry<P extends any[], R> = 
  P extends [infer First, ...infer Rest] 
    ? (arg: First) => Curry<Rest, R>
    : R;

declare function curried<A extends any[], R>(fn: (...args: A) => R): Curry<A, R>;

const sum = (a: number, b: number, c: number) => a + b + c;
const curriedSum = curried(sum);
const result = curriedSum(1)(2)(3); // 6
```

### 4.3 Registry Pattern (Registro de Serviços)

Mantém um mapa de construtores ou funções com chaves tipadas via `Record`.

```typescript
interface ServiceMap {
  user: { getName(): string };
  product: { getPrice(): number };
}

class ServiceRegistry {
  private services: Partial<Record<keyof ServiceMap, ServiceMap[keyof ServiceMap]>> = {};
  
  register<K extends keyof ServiceMap>(key: K, service: ServiceMap[K]) {
    this.services[key] = service;
  }
  
  get<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
    if (!this.services[key]) throw new Error('Service not found');
    return this.services[key] as ServiceMap[K];
  }
}
```

---

## 🔌 5. Padrões de Declaração e Módulos

### 5.1 Module Augmentation (Aumento de Módulo)

Estende definições de terceiros ou globais.

```typescript
// Augmentando o Array global
declare global {
  interface Array<T> {
    last(): T | undefined;
  }
}

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
}
```

### 5.2 Declaration Merging (Fusão de Declarações)

Combina múltiplas declarações de mesma interface/namespace.

```typescript
interface Config {
  port: number;
}
interface Config {
  host: string;
}
// Resultado: Config { port: number; host: string; }

// Útil para bibliotecas com plugins
namespace Validation {
  export interface Validator {}
}
namespace Validation {
  export interface EmailValidator extends Validator {}
}
```

---

## 🎯 6. Padrões para Hooks e React (Interseção)

Embora o foco seja TypeScript puro, estes padrões são cruciais no ecossistema React:

### 6.1 Typing Custom Hooks com Overloads

```typescript
function useState<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void];
function useState<T = undefined>(): [T | undefined, (v: T | ((prev: T) => T)) => void];
// Implementação...
```

### 6.2 Higher-Order Components (HOC) com Injeção de Props

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

## 📋 7. Checklist para Entrevistas Sênior

| Pergunta | Padrão/Conceito cobrado |
| :--- | :--- |
| *"Como você faria um sistema de eventos onde o nome do evento dita o tipo do payload?"* | Template Literals + Mapped Types (ex: `EventMap[K]`) |
| *"Como evitar que IDs de diferentes entidades se misturem?"* | Branded Types / Opaque Types |
| *"Como criar um utilitário que extrai o tipo de retorno de uma função assíncrona?"* | `Awaited<ReturnType<T>>` + Conditional Types |
| *"Como você implementaria um Redux reducer seguro sem `any`?"* | Discriminated Unions para ações (`type` + `payload`) |
| *"Como garantir que um objeto config tenha todas as chaves de um enum, mas permita valores adicionais?"* | `Record<Enum, T> & Partial<Record<string, unknown>>` |
| *"Como tipar um `compose` de funções com número variável de argumentos?"* | Variadic Tuple Types + `infer` recursivo |

---

## 🧠 Desafio Prático Final

**Construa uma função `createApiClient` que:**

1. Recebe uma URL base e um objeto de endpoints.
2. Cada endpoint tem método (GET/POST) e path com parâmetros (ex: `/users/:id`).
3. Retorna um cliente onde cada endpoint é um método que aceita os parâmetros e o body (se POST) e retorna uma Promise tipada.
4. Use **Template Literal Types** para extrair os parâmetros do path.
5. Use **Conditional Types** para definir o body obrigatório apenas para POST.

---

## 📚 Referências e Ferramentas

- `ts-reset` – Corrige tipos nativos problemáticos.
- `zod` – Validação em runtime com inferência de tipos estáticos.
- `type-fest` – Coleção de utility types avançados (ex: `OmitIndexSignature`, `DelimiterCasedProperties`).
- ESLint: `@typescript-eslint/consistent-type-imports` – Força `import type` para melhor bundling.

---

> **Conclusão:** Dominar estes padrões não é apenas sobre escrever tipos, mas sobre **modelar domínios, prevenir bugs em tempo de compilação e criar APIs intuitivas**. O verdadeiro poder do TypeScript emerge quando os tipos guiam a implementação, e não apenas a documentam.