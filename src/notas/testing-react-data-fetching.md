---
title: "Testando Componente React que Busca Dados no Mount"
layout: base.njk
category: Frontend
tags: [testing, react, frontend, interview]
---

Nota de [[nix-interview-prep|preparação para a N-iX]] — caso prático de [[frontend-testing-practices|testes de frontend]].

**Resumo:** testo os três estados: **loading**, **success** e **error** — usando
**React Testing Library** e **MSW (Mock Service Worker)**.

## Passos

1. **Mockar a API (MSW):** interceptar o fetch e retornar dados fake; configurar
   respostas diferentes por caso de teste (sucesso, erro, loading).
2. **Testar o loading:** renderizar, garantir que um spinner/skeleton aparece e
   que os dados ainda não foram renderizados.
3. **Testar o sucesso:** MSW retorna sucesso; garantir que os dados são
   renderizados (`screen.getByText('User Name')`); checar que o loading some.
4. **Testar o erro:** MSW retorna 500 / erro de rede; garantir que uma mensagem de
   erro aparece; checar o retry (se implementado).
5. **Testar edge cases:** array vazio → "No items"; dataset muito grande → lida
   sem travar (talvez pular no unit, cobrir no E2E).

```tsx
test("exibe os dados do usuário após o fetch bem-sucedido", async () => {
  render(<UserProfile userId={1} />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
  const name = await screen.findByText("John Doe");
  expect(name).toBeInTheDocument();
});
```

**Prática do mundo real:** uso queries da Testing Library que se parecem com a
interação do usuário (`findBy`, `getBy`, `queryBy`) e evito testar detalhes de
implementação (ex.: checar se uma função específica foi chamada).

---

Relacionadas: [[azure-devops-cicd-pipeline|gates de CI/CD]] ·
[[shared-component-library-versioning|testes da lib de componentes]] ·
[[nix-interview-prep|índice]].
