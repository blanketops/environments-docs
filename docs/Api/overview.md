# API Overview

BlanketOps Environments is composed of Kubernetes Custom Resource Definitions (CRDs) grouped into four primary API domains:

### sources.blanketops.dev

Defines source origin and event ingestion.

- GitRepository

### events.blanketops.dev

Defines external capture of events.

- GitHubEvent

### environments.blanketops.dev

Defines delivery, artifact, and runtime modeling.

- Environment
- Build
- Package
- ServiceUnit
- Deployment

### networks.blanketops.dev

Defines traffic exposure and certificate/DNS mapping.

- Route
- Domain

Each resource defines a `contract` field that governs non-negotiable structural behavior.

The API is designed to:

- Reduce delivery entropy
- Enforce explicit state transitions
- Preserve artifact lineage
- Govern runtime projection
- Constrain traffic exposure
- Govern certificate and DNS mapping lifecycle
- Scope execution identity
