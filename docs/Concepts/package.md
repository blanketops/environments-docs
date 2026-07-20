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
spec:
  contract:
    name: for-kaniko-app
    version: v1.0.0
    enabled: true
    packageName: for-kaniko-app
    packageVersion: v1.2.3
    packageDescription: >
      This package contains the API deployment manifests and runtime configuration.
    packageMaintainers:
      - name: Neo
        email: neo@blanketops.online
    packageRepository:
      url: git@github.com:blanketops01/for-kaniko-app-packages.git
      credentialsSecret: git-ssh-credentials-packages
    packageKappDiff: true
    stateRepo:
      url: git@github.com:blanketops01/for-kaniko-app-state.git
      ref:
        branch: master
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

`packageName / packageVersion`

Separates internal object identity from distributed version.

This distinction allows:

- Semantic versioning.
- Registry-based distribution.
- Promotion without renaming CR.

`packageDescription`

Defines human-readable context.

This makes Package:

- Self-documenting.
- Discoverable.
- Maintained as a product unit.

`packageMaintainers`

Declares ownership.

This supports:

- Governance.
- Escalation clarity.
- Team accountability.

Packages are owned artifacts.

`packageRepository`

Defines configuration bundle source.

```yaml
packageRepository:
  url: git@github.com:blanketops01/for-kaniko-app-packages.git
```

This constrains:

- Manifest origin.
- Versioned configuration.
- Distribution lineage.
- Package configuration cannot drift outside declared repo.

`packageKappDiff`

Controls diff strategy behavior.

Enables:

- Declarative drift visibility.
- Safe reconciliation.
- Deterministic diff projection.

This is runtime governance support.

`stateRepo`

Defines environment state projection repository.

```yaml
stateRepo:
  url: git@github.com:blanketops01/for-kaniko-app-state.git
  ref:
    branch: master
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

The Package controller is responsible for:

- Validating package metadata.
- Resolving configuration repository.
- Tracking version identity.
- Managing environment state projection.
- Enforcing enabled flag.

It does not:

- Build artifacts.
- Execute runtime containers.
- Trigger external events.
- It governs configuration distribution.

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
