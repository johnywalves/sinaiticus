---
title: "Versionamento de Biblioteca de Componentes (adoção segura em MFEs)"
layout: base.njk
category: Frontend
tags: [component-library, versioning, frontend, interview]
---

Nota de [[nix-interview-prep|preparação para a N-iX]] — design system entre MFEs.

**Resumo:** uso **versionamento semântico**, **changelogs automatizados** e uma
**estratégia de adoção em fases** para manter os MFEs seguros e alinhados.

## 1. Versionamento (SemVer)

- **Patch** – correções de bug, refatorações internas (sem breaking changes).
- **Minor** – novas features, deprecações (retrocompatível).
- **Major** – breaking changes (mudança de API, remoção de props).

## 2. Automação de publicação

- Cada PR para `main` roda testes + build.
- No merge, o CI (GitHub Actions) sobe a versão conforme as mensagens de commit
  (Conventional Commits) e publica num registry npm privado (ou Azure Artifacts).
- Um `CHANGELOG.md` é gerado automaticamente.

## 3. Estratégia de adoção

- **Versões canary:** publicar pré-releases (`@next`, `@alpha`) para early
  adopters antes do release oficial.
- **Janela de deprecação:** breaking changes anunciadas com 2–4 semanas de
  antecedência; API antiga mantida em paralelo com avisos de deprecação.
- **Restrições de versão:** os MFEs especificam ranges (ex.: `^1.5.0`) e ficam em
  versões antigas até estarem prontos para atualizar.

## 4. Testar a lib isoladamente

**Storybook** para visualizar componentes, **Jest + React Testing Library** para
testes unitários e **Cypress** para integração. Cada componente testado em todos
os temas/variantes suportados. Ver [[testing-react-data-fetching|testes de componentes]].

## 5. Documentação

Gerada via **Storybook** + markdown. Inclui exemplos de uso, tabelas de props e
guias de migração para breaking changes.

## Exemplo real (WeFit)

3 MFEs consumiam nossa lib de componentes. Um release major mudou a nomenclatura
das variantes do `Button`. Usamos a janela de deprecação e fornecemos um codemod
para automatizar a migração. Todos os MFEs atualizaram em 2 semanas.

---

Relacionadas: [[microfrontend-communication|micro-frontends]] ·
[[azure-devops-cicd-pipeline|CI/CD]] · [[nix-interview-prep|índice]].
