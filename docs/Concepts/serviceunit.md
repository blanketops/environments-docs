# ServiceUnit

The ServiceUnit represents a runtime workload contract derived from a resolved artifact.

It defines:

- Artifact source
- Runtime shape
- Scaling boundary
- Application role
- Stack classification

ServiceUnit is not a Kubernetes Deployment.

It is the deterministic workload abstraction of BlanketOps.

Position in Delivery

```mathematica
Build → Package → ServiceUnit → Deployment → Route
```

ServiceUnit bridges:

```mathematica
Artifact identity → Runtime projection
```

It transforms artifact output into structured workload intent.

Why ServiceUnit Exists

Traditional systems bind:

- Image references
- Deployment manifests
- Replica count
- Port exposure
- Application role

directly into Kubernetes YAML.

This creates:

- Artifact drift
- Repetition
- Environment coupling
- Implicit scaling

BlanketOps isolates runtime workload definition into a governed object.

ServiceUnit defines workload identity once.

Deployment projects it.

Two Contract Types

ServiceUnit supports multiple artifact sourcing strategies.

1️⃣ Static Artifact
apiVersion: environments.blanketops.dev/v1
kind: ServiceUnit
metadata:
name: for-kaniko-app-api
spec:
contract:
type: static
image: docker.io/nkanyezisolutions/for-kaniko-app:master

    containerPort: 8080
    size: 2

    appType: web
    stackType: nodejs

Static contract means:

Image is explicitly declared

No build lineage required

Artifact must already exist

This is deterministic but externally resolved.

2️⃣ Build-Derived Artifact
apiVersion: environments.blanketops.dev/v1
kind: ServiceUnit
metadata:
name: for-buildah-app-worker
spec:
contract:
type: build
buildRef:
name: for-buildah-app

    containerPort: 9000
    size: 1

    appType: worker
    stackType: python

Build contract means:

Artifact must originate from a Build

Image lineage is enforced

Runtime cannot drift from build output

This ties runtime to deterministic artifact production.

Contract Semantics

The contract field defines workload shape.

type

Declares artifact resolution mode.

static → external image reference

build → artifact derived from Build

Type controls lineage enforcement.

image (static only)

Explicit image reference.

Prevents ambiguous artifact injection.

buildRef (build type only)

References a Build object.

This enforces:

Artifact traceability

Revision lineage

Controlled mutation

Runtime must align with build output.

containerPort

Declares internal container port.

This constrains:

Service projection

Route binding

Runtime validation

Port exposure is explicit.

size

Defines replica count.

This governs:

Horizontal scale

Runtime projection

Resource footprint

Scaling is declared, not inferred.

appType

Classifies application role.

Examples:

web

worker

cron

api

This enables:

Routing policies

Deployment grouping

Operational semantics

Role is explicit.

stackType

Declares technology stack.

Examples:

nodejs

python

go

This enables:

Runtime defaults

Observability templates

Stack-aware tooling

Stack identity is declared, not guessed.

Entropy Reduction at Workload Layer

Before ServiceUnit:

Artifact exists

Runtime configuration may vary

Scale may drift

Role may be implicit

After ServiceUnit:

Artifact source is explicit

Scale is constrained

Port is declared

Role is classified

Stack is known

Runtime possibility space collapses.

Reconciliation Responsibility

The ServiceUnit controller is responsible for:

Resolving artifact reference

Validating buildRef if applicable

Enforcing contract completeness

Surfacing readiness state

It does not:

Apply manifests directly

Route traffic

Modify build artifacts

It defines workload contract.

Design Principles

Artifact source must be explicit

Scale must be declared

Role must be classified

Stack must be visible

Runtime must be deterministic

ServiceUnit formalizes workload identity.

What This Enables

Clear separation of artifact and runtime

Deterministic scaling

Role-aware deployment

Multi-service grouping

Predictable routing

ServiceUnit is the workload contract of BlanketOps.
