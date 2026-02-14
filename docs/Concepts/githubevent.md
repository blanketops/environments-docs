# GitHubEvent

The GitHubEvent represents a normalized, governed delivery trigger derived from an external webhook.

It is not a raw webhook payload.

It is a structured event object inside the BlanketOps domain.

GitHubEvent converts external activity into internal intent.

## Why GitHubEvent Exists

Webhooks are:

- Unstructured
- Provider-specific
- Ephemeral
- External

Non-authoritative

BlanketOps does not allow raw webhooks to drive delivery directly.

Instead:

- A GitRepository receives a webhook.
- The payload is validated against the repository contract.
- A GitHubEvent object is created.
- Delivery progression begins.

This prevents uncontrolled execution.

### Structural Position in Delivery

```mathematica
GitHubEvent GitHubEvent BuildTrigger Build Deploy ServiceUnit
```

GitHubEvent establishes:

- Revision identity
- Trigger legitimacy
- Event type
- Provider lineage
- Transition boundary

Without it, progression cannot begin.

Conceptual Example

```yaml
apiVersion: sources.blanketops.dev/v1
kind: GitHubEvent
metadata:
  name: for-kaniko-app-3f2c91d
  labels:
    sources.blanketops.dev/gitrepository: for-kaniko-app
spec:
  repositoryRef:
    name: for-kaniko-app
    eventType: push
    revision: 3f2c91d
    branch: main
```

## Contract Semantics

GitHubEvent is derived from a valid GitRepository contract.

It enforces:

- Repository identity binding
- Allowed event type validation
- Revision normalization
- Branch scoping

A GitHubEvent cannot exist without:

- A valid GitRepository
- A declared webhook event
- A recognized provider
- Entropy Reduction at Trigger Boundary

Without normalization:

- Payload schemas vary
- Events are inconsistent
- Branch logic leaks into pipelines
- Revision lineage becomes ambiguous

With GitHubEvent:

- External payload becomes structured state
- Revision becomes authoritative
- Event type becomes constrained
- Trigger becomes observable
- Entropy is reduced before artifact creation.

## Reconciliation Responsibility

The GitHubEvent controller is responsible for:

- Validating event against repository contract
- Normalizing provider payload
- Persisting revision identity
- Emitting BuildTrigger creation

It does not:

- Build artifacts
- Deploy workloads
- Modify runtime state
- It converts signal into governed intent.

## Design Principles

- External events must be normalized
- Trigger legitimacy must be enforced
- Revision identity must be explicit
- State must replace ephemeral execution

GitHubEvent is the ignition layer of deterministic delivery.

### What This Enables

- Traceable build lineage
- Auditable trigger history
- Multi-branch isolation
- Controlled CI entrypoint
- Deterministic progression start

Delivery does not begin with a pipeline.

It begins with a structured event.
