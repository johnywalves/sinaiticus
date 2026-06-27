---
title: "Pipeline CI/CD no Azure DevOps (test, artifact, coverage gates)"
layout: base.njk
category: DevOps
tags: [ci-cd, azure-devops, devops, interview]
---

Nota de [[nix-interview-prep|preparação para a N-iX]] — pipeline de entrega.

**Resumo:** estruturo o pipeline em estágios: Build → Test → Quality Gates →
Pack → Deploy. Cada estágio precisa passar antes do próximo rodar.

## 1. Source & Build

- Pull da `main` / feature branch.
- Instalar dependências (`npm ci`).
- Buildar a aplicação (Next.js / React) — saída em `dist/` ou `build/`.

## 2. Estágio de testes

- **Testes unitários:** `jest --coverage` → relatório de cobertura (JUnit/HTML).
- **Testes de integração:** `playwright test` / `cypress run`.
- **Lint & formatação:** `eslint`, `prettier` — falham o pipeline em violações.

Ver detalhes em [[testing-react-data-fetching|testando componentes React]].

## 3. Quality Gates (política do Azure DevOps)

- **Gate de cobertura:** mínimo de **80%** (configurável). Abaixo disso, o pipeline falha.
- **Scan de vulnerabilidades:** `npm audit` / `snyk` — bloqueia em vulns críticas/altas.
- **SonarQube:** análise estática mais profunda. Gates: "No new bugs", "dívida técnica < 5%".

## 4. Publicação de artefato

Se todos os gates passam, o artefato de build (ex.: `.zip` de `dist/`) é publicado
no Azure Artifacts ou num Container Registry.

## 5. Estágio de deploy (ambientes)

- **Dev:** deploy automático após merge na `develop`.
- **Staging:** gatilho de aprovação manual (ou canary).
- **Produção:** aprovação manual + janela agendada.

## 6. Monitoramento

Integrar **Application Insights** e **New Relic** para acompanhar a performance
após o deploy. Rollback automático dispara se a taxa de erros sobe.

## Experiência real (Seguralta)

Usamos BitBucket Pipelines (similar ao Azure DevOps). O gate de cobertura pegou
uma queda de 5% e impediu um release. O time corrigiu os testes e elevou a
cobertura para 85% antes de subir.

---

Relacionadas: [[shared-component-library-versioning|versionamento da lib]] ·
[[nix-interview-prep|índice]].
