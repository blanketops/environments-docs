Deployment

The Deployment represents the governed runtime projection of one or more ServiceUnits.

It defines:

Which ServiceUnits are deployed

Which runtime substrate executes them

How manifests are reconciled

Whether image automation is enabled

Which strategy governs runtime mutation

Deployment does not build artifacts.

Deployment does not route traffic.

Deployment projects artifact-backed ServiceUnits into runtime state.

Position in Delivery
GitRepository
↓
GitHubEvent
↓
BuildTrigger
↓
Build
↓
ServiceUnit
↓
Deployment
↓
Route

Deployment binds resolved ServiceUnits into runtime configuration.

It is the runtime governance boundary.

Why Deployment Exists

Traditional systems blur runtime configuration and artifact delivery:

GitOps repos contain both manifests and image tags

CI modifies YAML directly

Runtime state is mutated implicitly

Drift becomes hard to reason about

BlanketOps separates:

Artifact resolution (Build → ServiceUnit)
Runtime orchestration (Deployment)

Deployment is where artifact meets environment.

Example
apiVersion: environments.blanketops.dev/v1alpha1
kind: Deployment
metadata:
name: for-kaniko-app
spec:
contract:
serviceUnits: - for-kaniko-app-api

    runtime: kubernetes.io/container-runtime

    imageAutomation: false
    reconciliationStrategy: kustomize

    manifestsRepo:
      url: git@github.com:ntlaletsi70/for-kaniko-app-deployment.git
      cloneSecret: git-ssh-credentials
      strategy: kustomization
      path: ./bases/kustomization.yaml

Contract Semantics

The contract field defines runtime projection rules.

serviceUnits

Declares which ServiceUnits are deployed.

This creates a structural binding between:

Artifact state → Runtime configuration

A Deployment cannot exist without declared ServiceUnits.

runtime

Declares execution substrate.

Example:

runtime: kubernetes.io/container-runtime

This allows:

Multi-runtime extensibility

Runtime abstraction

Future substrate expansion

Runtime is explicit, not assumed.

imageAutomation

Controls whether image updates are automatically reconciled.

false → image updates must be deliberate

true → Deployment tracks artifact changes

This prevents uncontrolled drift.

reconciliationStrategy

Defines how runtime manifests are applied.

Example:

reconciliationStrategy: kustomize

This allows:

Strategy abstraction

Deterministic reconciliation

Pluggable manifest engines

The strategy itself is part of the contract.

manifestsRepo

Declares manifest source.

manifestsRepo:
url: git@github.com:ntlaletsi70/for-kaniko-app-deployment.git
cloneSecret: git-ssh-credentials
strategy: kustomization
path: ./bases/kustomization.yaml

This constrains:

Runtime manifest origin

Authentication boundary

Reconciliation path

Git-based governance

Deployment does not mutate YAML blindly.

It projects ServiceUnit state into governed manifests.

Entropy Reduction at Runtime Layer

Before Deployment:

Artifact exists

Runtime intent may vary

Manifests may drift

After Deployment:

Runtime projection is explicit

Strategy is declared

Image automation is controlled

Manifest origin is constrained

Deployment narrows runtime possibility space.

Multi-Service Example
spec:
contract:
serviceUnits: - for-kaniko-app-api - for-kaniko-app-worker

    runtime: kubernetes.io/container-runtime

    imageAutomation: true

    manifestsRepo:
      url: git@github.com:ntlaletsi70/for-buildpacks-deployment.git
      cloneSecret: git-ssh-credentials
      strategy: kustomization
      path: ./bases/kustomization.yaml

This allows:

Multi-ServiceUnit binding

Coordinated runtime projection

Environment-level grouping

Deployment becomes environment-aware orchestration.

Reconciliation Responsibility

The Deployment controller is responsible for:

Resolving ServiceUnit image references

Injecting artifact digest into manifests

Executing reconciliation strategy

Surfacing runtime drift

Managing image automation policies

It does not:

Build artifacts

Trigger events

Route traffic directly

It governs runtime projection.

Design Principles

Runtime must be explicit

Manifest origin must be constrained

Strategy must be declared

Artifact injection must be deterministic

Drift must be visible

Deployment prevents runtime entropy.

What This Enables

Deterministic GitOps projection

Controlled image promotion

Multi-environment deployments

Runtime strategy abstraction

Structured environment orchestration

Deployment formalizes the boundary between artifact and runtime.
