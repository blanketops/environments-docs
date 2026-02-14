BuildTrigger

The BuildTrigger governs when a Build is allowed to execute.

It is a policy boundary between normalized external events and artifact creation.

BuildTrigger does not build artifacts.

It decides whether a Build may be created.

Why BuildTrigger Exists

Without BuildTrigger:

Every GitHubEvent could trigger a Build

Branch logic leaks into build execution

Policy becomes implicit

Event filtering becomes scattered

BlanketOps separates:

Event normalization → Policy evaluation → Artifact execution

This preserves structural clarity.

Position in Delivery
GitRepository
↓
GitHubEvent
↓
BuildTrigger
↓
Build
↓
Deploy
↓
ServiceUnit

BuildTrigger enforces:

Event filtering

Branch scoping

Repository binding

Execution targeting

It reduces entropy before artifact creation.

Example
apiVersion: environments.blanketops.dev/v1alpha1
kind: BuildTrigger
metadata:
name: github-push-main
spec:
contract:
source: github
eventType: push

    repository:
      owner: ntlaletsi70
      name: for-kaniko-app

    ref: refs/heads/main

    buildRef:
      name: build-sample-kaniko

    payloadPolicy:
      allow: true

Contract Semantics

The contract field defines trigger eligibility.

source

Declares event provider.

This prevents cross-provider ambiguity.

eventType

Specifies which event is eligible.

Example:

eventType: push

This constrains transition type.

Pull requests and pushes are not interchangeable.

repository

Binds trigger to a specific repository identity.

Even if multiple repositories exist in the cluster, this trigger only matches one.

ref

Constrains branch or reference.

Example:

ref: refs/heads/main

This prevents:

Feature branch builds from triggering production pipelines

Accidental execution from unintended refs

Branch scoping is explicit.

buildRef

Defines which Build object should execute when policy matches.

This decouples:

Policy evaluation from execution logic.

payloadPolicy

Controls whether raw event payload is exposed to downstream systems.

This allows:

Advanced build logic

Metadata extraction

Controlled dynamic behavior

Without forcing every build to parse provider payloads.

Status Model (Conceptual)
status:
phase: Pending | Ignored | Executed | Failed
lastMatch:
eventName: ""
sha: ""
triggeredAt: ""
buildRunRef: ""
conditions: []

This allows:

Observability

Auditability

Trigger history tracking

Clear execution state

Entropy Reduction at Policy Layer

Before BuildTrigger:

All GitHubEvents are potential execution sources

After BuildTrigger:

Only declared events

From declared repository

On declared branch

For declared buildRef

may proceed.

The possibility space collapses further.

Reconciliation Responsibility

The BuildTrigger controller is responsible for:

Matching GitHubEvent against contract

Evaluating branch constraints

Creating Build execution signal

Recording trigger status

It does not:

Execute build logic

Deploy workloads

Modify artifacts

It enforces policy.

Design Principles

Policy must be explicit

Execution must be deliberate

Branch logic must be declarative

Event filtering must be structural

Trigger eligibility must be observable

BuildTrigger protects the artifact boundary.

What This Enables

Multi-branch governance

Environment isolation

Controlled CI/CD flows

Explicit promotion patterns

Deterministic event filtering

Delivery without explicit trigger policy is fragile.

BuildTrigger enforces intent before execution.
