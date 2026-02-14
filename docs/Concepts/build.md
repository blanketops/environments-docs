# Build

The Build represents the deterministic transformation of governed source into a container artifact.

It is the artifact constraint layer of the delivery model.

- Build does not deploy.
- Build does not route.
- Build does not mutate runtime.

Build produces a verifiable, traceable image artifact.

### Position in Delivery

```mathematica
GitRepository → GitHubEvent → BuildTrigger → Build → Deployment → ServiceUnit
```

Build marks the transition from:

```mathematica
External event → Internal artifact
```

This is the most significant entropy reduction stage in delivery.

Why Build Exists as a First-Class Object

Traditional CI systems treat builds as:

- Ephemeral jobs
- Pipeline steps
- Log outputs
- Side effects

BlanketOps models build as state.

Because:

- Artifacts must be traceable
- Strategies must be declared
- Source must be constrained
- Execution must be governed
- Policies must be enforced
- Build is not a step.

It is a state boundary.

Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Build
metadata:
name: for-kaniko-app
spec:
contract:
image: docker.io/nkanyezisolutions/for-kaniko-app:master

    strategy:
      kind: ClusterBuildStrategy
      name: kaniko

    source:
      url: git@github.com:ntlaletsi70/for-kaniko-app.git
      revision: master
      contextDir: .
      cloneSecret: git-ssh-credentials

    serviceAccount:
      name: build-bot
      secret: registry-credentials

    policy:
      triggers:
        - type: pull_request
        - type: push
```

## Contract Semantics

The contract field defines non-negotiable artifact boundaries.

`image`

Declares the artifact destination.

This constrains:

- Registry location
- Tag lineage
- Deployment compatibility

Build output cannot drift outside this boundary.

`strategy`

Defines the execution mechanism.

Example:

```yaml
strategy:
  kind: ClusterBuildStrategy
  name: kaniko
```

This makes build execution:

- Explicit
- Auditable
- Replaceable
- Cluster-governed

No hidden docker builds.
No local overrides.

`source`

Declares source origin and revision.

```yaml
source:
  url: git@github.com:ntlaletsi70/for-kaniko-app.git
  revision: master
  contextDir: .
  cloneSecret: git-ssh-credentials
```

This constrains:

- Repository identity
- Revision boundary
- Build context
- Authentication mechanism

Build cannot consume ambiguous source.

`serviceAccount`

Defines execution identity.

Builds do not run with uncontrolled privileges.

This enforces:

- Registry access control
- Secret scoping
- Cluster RBAC boundaries

`policy`

Controls allowed triggers and retry semantics.

Example:

```yaml
policy:
  triggers: - type: pull_request - type: push
```

This ensures:

- Only declared GitHubEvents can create BuildTriggers
- Unapproved transitions are rejected
- Delivery progression remains deterministic
- Entropy Reduction at Artifact Boundary

Before Build:

- Code is mutable
- Branches may vary
- Context may shift

After Build:

- Artifact digest is fixed
- Image is addressable
- Execution environment is known
- Lineage is traceable
- The possibility space collapses.

This is deterministic artifact creation.

## Reconciliation Model

The Build controller is responsible for:

- Validating contract completeness
- Executing strategy
- Capturing build status
- Persisting artifact digest
- Emitting downstream readiness signal

It does not:

- Deploy workloads
- Modify routing
- Bypass policy

Build produces constrained output.

## Design Principles

- Artifact production must be explicit
- Execution strategy must be declared
- Source must be constrained
- Policy must be enforced
- Identity must be scoped
- Build is the artifact truth boundary.

### What This Enables

- Deterministic deployment inputs
- Artifact traceability
- Strategy abstraction (Kaniko, Buildah, etc.)
- Secure multi-tenant builds
- Controlled CI evolution
- Delivery without structured artifact modeling is fragile.

Build makes artifact creation deterministic.
