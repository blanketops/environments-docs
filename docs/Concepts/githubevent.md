# GitHubEvent

The GitHubEvent represents a normalized, governed delivery trigger derived from an external webhook.

It is not a raw webhook payload.

It is a structured event object inside the BlanketOps Environments domain.

GitHubEvent converts external activity into internal intent.

## Why GitHubEvent Exists

Webhooks are:

- Unstructured.
- Provider-specific.
- Ephemeral.
- External.

Non-authoritative

BlanketOps Environments does not allow raw webhooks to drive delivery directly.

Instead:

- A GitRepository receives a webhook.
- The payload is validated against the repository contract.
- A GitHubEvent object is created.
- Delivery progression begins.

This prevents uncontrolled execution.

### Structural Position in Delivery

```mathematica
GitRepository → GitHubEvent → Build → Deploy → ServiceUnit
```

GitHubEvent establishes:

- Revision identity.
- Trigger legitimacy.
- Event type.
- Provider lineage.
- Transition boundary.

Without it, progression cannot begin.

Conceptual Example

```yaml
apiVersion: events.blanketops.dev/v1alpha1
kind: GitHubEvent
metadata:
  name: push-main-001
  namespace: dev
spec:
  contract:
    repository: example-org/for-kaniko-app
    eventType: push
    ref: refs/heads/main
    commitSHA: 3f2c91d
    webhook:
      secretRef:
        name: github-webhook-secret
        key: secret
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

The GitHubEvent controller converts signal into governed intent, and hands off from there:

- Validating event against repository contract
- Normalizing provider payload
- Persisting revision identity
- Marking the event as triggered against the eligible Build, once its allowed-trigger policy matches

[Build](build.md) takes it from there — artifact production and runtime state belong to the stages downstream of this one.

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
