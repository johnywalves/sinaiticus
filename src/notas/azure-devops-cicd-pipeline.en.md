---
title: "CI/CD Pipeline on Azure DevOps (test, artifact, coverage gates)"
layout: base.njk
category: DevOps
tags: [ci-cd, azure-devops, devops, interview]
---

Note from the [[nix-interview-prep|N-iX interview prep]] — delivery pipeline.

**Summary:** I structure the pipeline in stages: Build → Test → Quality Gates →
Pack → Deploy. Each stage must pass before the next runs.

## 1. Source & Build

- Pull from `main` / feature branch.
- Install dependencies (`npm ci`).
- Build the application (Next.js / React) — outputs to `dist/` or `build/`.

## 2. Test Stage

- **Unit tests:** `jest --coverage` → coverage report (JUnit/HTML).
- **Integration tests:** `playwright test` / `cypress run`.
- **Linting & formatting:** `eslint`, `prettier` — fail the pipeline on violations.

See details in [[testing-react-data-fetching|testing React components]].

## 3. Quality Gates (Azure DevOps Policy)

- **Code coverage gate:** minimum **80%** (configurable). Below it, pipeline fails.
- **Vulnerability scan:** `npm audit` / `snyk` — blocks on critical/high vulns.
- **SonarQube:** deeper static analysis. Gates: "No new bugs", "Technical debt < 5%".

## 4. Artifact Publishing

If all gates pass, the build artifact (e.g., `.zip` of `dist/`) is published to
Azure Artifacts or a Container Registry.

## 5. Deploy Stage (environments)

- **Dev:** automatic deployment after merge to `develop`.
- **Staging:** manual approval trigger (or canary).
- **Production:** manual approval + scheduled window.

## 6. Monitoring

Integrate **Application Insights** and **New Relic** to track performance after
deployment. Automatic rollback triggers if error rates spike.

## Real-world experience (Seguralta)

We used BitBucket Pipelines (similar to Azure DevOps). The coverage gate caught a
5% drop and prevented a release. The team fixed tests and improved coverage to
85% before shipping.

---

Related: [[shared-component-library-versioning|library versioning]] ·
[[nix-interview-prep|index]].
