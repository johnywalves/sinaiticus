---
title: "Versionamento de Biblioteca de Componentes (adoção segura em MFEs)"
layout: base.njk
category: Frontend
tags: [component-library, versioning, frontend, interview]
---

**Summary:** I use **semantic versioning**, **automated changelogs**, and a
**phased adoption strategy** to keep MFEs safe and aligned.

## 1. Versioning (SemVer)
- **Patch** – bug fixes, internal refactors (no breaking changes).
- **Minor** – new features, deprecations (backward-compatible).
- **Major** – breaking changes (API changes, removal of props).

## 2. Publishing automation
- Each PR to `main` runs tests + build.
- On merge, CI (GitHub Actions) bumps version based on commit messages
  (Conventional Commits) and publishes to a private npm registry (or Azure
  Artifacts).
- A `CHANGELOG.md` is generated automatically.

## 3. Adoption strategy
- **Canary versions:** publish pre-release versions (`@next`, `@alpha`) for early
  adopters before the official release.
- **Deprecation window:** breaking changes announced 2–4 weeks in advance; old API
  kept in parallel with deprecation warnings.
- **Version constraints:** MFEs specify ranges (e.g., `^1.5.0`) and stay on older
  versions until ready to upgrade.

## 4. Testing the library in isolation
**Storybook** to visualise components, **Jest + React Testing Library** for unit
tests, and **Cypress** for integration tests. Each component tested in all
supported themes/variants. Ver [[testing-react-data-fetching|testes de componentes]].

## 5. Documentation
Generated via **Storybook** + markdown. Includes usage examples, prop tables, and
migration guides for breaking changes.

## Real-world example (WeFit)
3 MFEs consumed our component library. A major release changed the `Button`
variant naming. We used the deprecation window and provided a codemod to automate
the migration. All MFEs updated within 2 weeks.

---
Relacionadas: [[microfrontend-communication|micro-frontends]] ·
[[azure-devops-cicd-pipeline|CI/CD]] · [[nix-interview-prep|índice]].
