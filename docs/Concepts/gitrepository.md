# GitRepository

The GitRepository defines the authoritative source boundary for delivery.

It represents:

- Ownership of code origin.
- Provider contract.
- Event legitimacy.
- Webhook integration.
- Repository identity.

Without a GitRepository, delivery has no governed origin.

## Why GitRepository Exists

Modern CI/CD systems often treat repositories as loose configuration:

- Webhooks are configured manually.
- Pipelines are wired independently.
- Repository references are duplicated.
- Event legitimacy is assumed.

BlanketOps Environments makes repository origin a first-class domain object.

Delivery cannot progress without it.

## Structural Role in Delivery

The GitRepository sits at the start of deterministic progression:

```mathematica
GitRepository → GitHubEvent → Build → Deploy → Route → ServiceUnit
```

It establishes:

- Source ownership.
- Provider contract.
- Webhook authority.
- Namespace alignment.
- Environment binding.

Every downstream stage depends on it.

### Example

```yaml
apiVersion: sources.blanketops.dev/v1alpha1
kind: GitRepository
metadata:
  name: for-kaniko-app
  namespace: dev
spec:
  contract:
    provider: github
    hookUrl: https://your-webhook-endpoint.example.com/
    repository:
      owner: example-org
      name: for-kaniko-app
    webhooks:
      events:
        - push
        - pull_request
```

## Contract Semantics

The contract field is non-negotiable.

It defines the structural agreement between:

BlanketOps Environments

The source provider.

The delivery system.

`provider`

Declares the SCM provider.

This prevents ambiguous webhook handling and allows provider-specific validation.

`hookUrl`

Defines the inbound event endpoint.

This ensures:

- Events are scoped.
- Event legitimacy is verifiable.

External triggers are constrained.

`repository.owner / repository.name`

Establishes canonical repository identity.

Delivery artifacts must trace lineage back to this identity.

`webhooks.events`

Defines which events are accepted.

This prevents uncontrolled triggers.
Only declared transitions are valid.
Entropy Reduction at Origin.

### Without a GitRepository:

- Events could originate from anywhere.
- Build triggers lack structural context.
- Artifact lineage is unverifiable.
- Drift begins at the first step.

### With GitRepository:

- Source origin is constrained.
- Provider contract is explicit.
- Event scope is defined.
- Transition legitimacy is enforced.
- Entropy is reduced at the boundary.

## Reconciliation Model

The GitRepository controller establishes origin truth, and stops there:

- Validating provider configuration.
- Ensuring webhook registration.
- Observing connectivity status.
- Surfacing contract violations.

Triggering builds and resolving artifacts happen downstream, once [GitHubEvent](githubevent.md) and [Build](build.md) take over.

## Design Principles

- Source identity must be explicit.
- Event legitimacy must be constrained.
- Provider integration must be contractual.
- Delivery must trace lineage to origin.
- GitRepository is not configuration.

It is structural authority.

### What This Enables

- Deterministic build lineage.
- Controlled event ingestion.
- Multi-provider extensibility.
- Auditable delivery origin.
- Platform-level governance.

Delivery without governed origin is fragile.

GitRepository defines the boundary.
