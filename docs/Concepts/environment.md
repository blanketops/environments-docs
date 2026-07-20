# Environment

The Environment is the envelope of the delivery chain: a versioned, isolated execution context where an application runs.

It composes the resources that make up an application's delivery — Build, Package, ServiceUnit, Deployment, Route — by reference, and owns them via `ownerReference`.

Environment does not build, deploy, or route anything itself.

It is the boundary that holds a delivery chain together and deletes it as one unit.

## Why Environment Exists

Without a composing envelope:

- Build, Package, ServiceUnit, Deployment, and Route exist as loose, independently-lifecycled objects.
- Nothing enforces that they belong to the same application and branch.
- Deleting an application means hunting down every resource it touched.
- Multiple environments for the same application (dev, staging, production) have no structural boundary between them.

BlanketOps makes the environment itself a first-class object.

Every delivery resource is created inside one.

### Position in Delivery

```mathematica
Environment → GitRepository → GitHubEvent → Build → ServiceUnit → Deployment → Route → Domain
```

Environment does not sit inside this chain as a processing stage — it is the container the chain runs in. Every resource below it in the diagram carries an `ownerReference` back to its Environment.

### Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Environment
metadata:
  name: for-kaniko-app-main
spec:
  contract:
    applicationName: for-kaniko-app
    branch: main
    gitOwner: blanketops01
    environmentType: development
    version: v0.1.0
    serviceUnits:
      - name: for-kaniko-app-api
    deployment:
      name: for-kaniko-app
    route:
      name: route-sample
    build:
      name: build-sample-kaniko
```

## Contract Semantics

The contract defines application identity and composes the resources that belong to it.

`applicationName` / `gitOwner` / `branch`

Establish which application, source, and branch this environment represents.

Multiple Environments can exist for the same `applicationName` — one per branch, or one per environment type — without colliding.

`environmentType`

Classifies the environment: `development`, `staging`, `production`, or `testing`.

This lets policy (guardrails, approval gates, retention) key off environment class rather than naming convention.

`gitRepository`, `gitHubEvent`, `build`, `package`, `serviceUnits`, `deployment`, `route`, `domain`

Compose the delivery chain by reference. Each is an `ObjectRef` (a name resolved in the same namespace as the Environment) — Environment does not duplicate their contracts, it points at them.

`contract.secretStore`

Selects which external secrets backend (AWS, Vault, GCP, Azure) backs this environment's `ClusterSecretStore`. Environment does not hold credentials itself — it only tells the platform where to find them. Every composed CR that needs a credential (Build's Git clone key, Build's registry push credential, GitHubEvent's webhook secret) materializes its own `ExternalSecret` against that store, at a fixed platform key path. See the [API reference](../Api/Environments/environment.md#secrets--secretstore) for the exact paths — they must already hold a value in your secret backend before you apply an Environment that needs them.

## Reconciliation Responsibility

The Environment controller is responsible for:

- Resolving composed resource references.
- Aggregating per-resource readiness into a single environment phase.
- Cascading deletion to every resource it owns.

It does not:

- Build artifacts.
- Deploy workloads.
- Route traffic.

It aggregates and owns.

## Design Principles

- Every delivery resource belongs to exactly one Environment.
- Application identity must be explicit, not inferred from naming convention.
- Deleting an Environment must cleanly remove everything it composed.
- Environment is the lifecycle boundary, not a pipeline stage.

### What This Enables

- One `kubectl delete environment` tears down an entire application instance.
- Multiple isolated environments per application (dev/staging/production, per-branch previews).
- A single place to read aggregate delivery health.

Delivery resources are not free-floating. They live inside an Environment.
