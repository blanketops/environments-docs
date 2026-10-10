---
sidebar_position: 4
title: Governance
---

# Governance

The full document is [`GOVERNANCE.md`](https://github.com/blanketops/environments/blob/main/GOVERNANCE.md). In short:

- **Decisions** are made in the open, on GitHub issues and pull requests, by
  lazy consensus among maintainers. Breaking API or contract changes, adding
  or removing maintainers, and changing the governance itself need explicit
  maintainer approval.
- **Maintainers** review and merge, triage, release, own the roadmap and
  handle security and conduct reports. Contributors with a sustained record
  of good contributions can be nominated. The project has one maintainer
  today, and growing that group — including people from outside
  BlanketOps — is a priority.
- **Independence from BlanketOps' products.** BlanketOps builds commercial
  products on top of BlanketOps Environments. They are separate codebases
  that use the project's public APIs like any other adopter. No feature of
  the project is held back for a commercial product.

## Scope

The project is made up of these repositories, all under the Apache License 2.0:

| Repository | Purpose |
|---|---|
| [environments](https://github.com/blanketops/environments) | Resolution engine — turns Custom Resources into execution plans |
| [environments-api](https://github.com/blanketops/environments-api) | Kubernetes API types and CRD definitions |
| [environments-contract](https://github.com/blanketops/environments-contract) | Canonical contracts shared by every component |
| [environments-controller](https://github.com/blanketops/environments-controller) | Kubernetes controller that runs the reconciliation loops |
| [environments-cli](https://github.com/blanketops/environments-cli) | Command-line client |
| [environments-install](https://github.com/blanketops/environments-install) | Declarative installation (CRDs and controller manifests) |
| [environments-tests](https://github.com/blanketops/environments-tests) | Conformance test suite for the API surface |
| [environments-docs](https://github.com/blanketops/environments-docs) | This website |
| [secure-software-supplychain](https://github.com/blanketops/secure-software-supplychain) | Supply Chain plugin (Tekton, Kaniko, Trivy, Cosign, Grafeas) |
