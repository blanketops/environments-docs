# API Overview

BlanketOps Environments is composed of Kubernetes Custom Resource Definitions (CRDs) grouped into two primary API domains:

## sources.blanketops.dev

Defines source origin and event ingestion.

- GitRepository
- GitHubEvent

## environments.blanketops.dev

Defines delivery, artifact, runtime, and exposure modeling.

- BuildTrigger
- Build
- Package
- ServiceUnit
- Deployment
- Route

## Security Boundaries

- ServiceAccount

Each resource defines a `contract` field that governs non-negotiable structural behavior.

The API is designed to:

- Reduce delivery entropy
- Enforce explicit state transitions
- Preserve artifact lineage
- Govern runtime projection
- Constrain traffic exposure
- Scope execution identity
