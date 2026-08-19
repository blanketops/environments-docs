# Package

The Package represents a versioned, distributable delivery unit composed of runtime configuration, metadata, and state projection.

It defines:

- Version identity.
- Distribution metadata.
- Manifest source.
- Maintainer ownership.
- Environment state repository.
- Diff behavior.

Package is not a build artifact.

Package is not a runtime deployment.

Package is the structured distribution layer between artifact and environment state.

### Position in Delivery

```mathematica
Build → Package → Package → ServiceUnit → Deployment
```

Where:

- `Build` produces image artifact.
- `Package` defines versioned configuration bundle.
- `ServiceUnit` consumes resolved package context.
- `Deployment` projects into runtime.
- `Package` introduces versioned intent.

## Why Package Exists

Traditional delivery systems mix:

- Image versions.
- Manifest repositories.
- Runtime configuration.
- Environment state.
- Maintainer metadata.

This creates:

- Unclear ownership.
- Version drift.
- Weak promotion models.
- Poor auditability.

BlanketOps separates artifact from package.

Artifact = binary image.
Package = structured configuration unit.

This allows deterministic version governance.

Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Package
metadata:
  name: for-kaniko-app
  namespace: dev
spec:
  contract:
    enabled: true
    name: for-kaniko-app
    version: v1.2.3
    description: >
      This package contains the API deployment manifests and runtime configuration.
    maintainers:
      - name: Jane Doe
        email: jane@example.com
    repository:
      url: git@github.com:example-org/for-kaniko-app-packages.git
      credentialsSecret: git-ssh-credentials-packages
    diffEnabled: true
    stateRepository:
      url: git@github.com:example-org/for-kaniko-app-state.git
      ref: master
      cloneSecret: git-ssh-credentials-state
      strategy: kustomization
      path: ./clusters/dev
```

## Contract Semantics

The contract field defines package identity and projection rules.

`name / version`

Defines canonical package identity.

This allows:

- Version pinning.
- Promotion workflows.
- Controlled upgrades.
- Rollback capability.
- Package identity is explicit.

`enabled`

Controls whether package is active.

This enables:

- Feature toggling.
- Environment gating.
- Controlled rollout.

`description`

Defines human-readable context.

This makes Package:

- Self-documenting.
- Discoverable.
- Maintained as a product unit.

`maintainers`

Declares ownership.

This supports:

- Governance.
- Escalation clarity.
- Team accountability.

Packages are owned artifacts.

`repository`

Defines configuration bundle source.

```yaml
repository:
  url: git@github.com:example-org/for-kaniko-app-packages.git
```

This constrains:

- Manifest origin.
- Versioned configuration.
- Distribution lineage.
- Package configuration cannot drift outside declared repo.

`diffEnabled`

Controls diff strategy behavior.

Enables:

- Declarative drift visibility.
- Safe reconciliation.
- Deterministic diff projection.

This is runtime governance support.

`stateRepository`

Defines environment state projection repository.

```yaml
stateRepository:
  url: git@github.com:example-org/for-kaniko-app-state.git
  ref: master
  strategy: kustomization
  path: ./clusters/dev
```

This allows:

- Environment-specific projection.
- State separation.
- Promotion workflows.
- Multi-cluster targeting.
- Package becomes environment-aware.

## Entropy Reduction at Packaging Layer

Before Package:

Artifact exists.
Configuration may vary.
Environment state may drift.

After Package:

Version is fixed.
Maintainers are declared.
Manifest origin is constrained.
Environment state target is explicit.
Package reduces distribution entropy.

## Reconciliation Responsibility

The Package controller governs configuration distribution, and stops there:

- Validating package metadata.
- Resolving configuration repository.
- Tracking version identity.
- Managing environment state projection.
- Enforcing enabled flag.

Artifact production stays with [Build](build.md); running containers stays with [ServiceUnit](serviceunit.md) and [Deployment](deployment.md).

## Design Principles

- Version identity must be explicit.
- Distribution source must be constrained.
- Ownership must be declared.
- Environment projection must be deterministic.
- Drift must be observable.
- Package formalizes delivery as a distributable unit.

### What This Enables

Versioned delivery governance.
Controlled environment promotion.
Clear ownership boundaries.
Structured state management.
Deterministic configuration projection.

Package transforms delivery from execution to distribution discipline.
