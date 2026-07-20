# Route

The Route represents the governed traffic exposure contract for a deployed ServiceUnit.

It defines:

- Host binding.
- Path mapping.
- TLS policy.
- Runtime substrate.
- Exposure enablement.

Route is not an Ingress resource.

Route is the declarative traffic contract of a delivery unit.

### Position in Delivery

```mathematica
ServiceUnit → Deployment → Route → Domain
```

Where:

- ServiceUnit defines runtime workload.
- Deployment projects workload into environment.
- Route exposes workload to external traffic.
- Domain governs the TLS and DNS mapping chain for the Route's host.
- Route is the final public boundary of delivery.

Why Route Exists

Traditional systems treat ingress as:

- YAML inside a GitOps repo.
- Implicitly tied to deployment.
- Mutable without structural validation.
- Decoupled from artifact lineage.

BlanketOps separates:

- Runtime projection (Deployment).
- Traffic exposure (Route).

This prevents uncontrolled external surface mutation.

Example (Contractual Form)

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Route
metadata:
  name: route-sample
spec:
  contract:
    host: api.dev.blanketops.dev
    path: /
    enabled: true
    tlsEnabled: true
    runtime: kubernetes.io/container-runtime
```

Route must be governed.

Not implied.

## Contract Semantics

The contract defines non-negotiable exposure boundaries.

`host`

Declares external DNS identity.

This constrains:

- Public access surface.
- Certificate scope.
- Environment isolation.
- Host identity cannot drift silently.

`path`

Defines HTTP path binding.

Prevents:

- Uncontrolled wildcard exposure.
- Overlapping routing ambiguity.
- Shadow route conflicts.
- Path mapping is explicit.

`enabled`

Controls route activation.

This allows:

- Staged rollout.
- Maintenance toggling.
- Environment gating.
- Route exposure is deliberate.

`tlsEnabled`

Declares TLS requirement.

This enforces:

- Encrypted traffic.
- Certificate provisioning, delegated to an owned Domain resource.
- Security baseline.
- TLS is not inferred.
- It is declared.

Route does not provision certificates itself. When `tlsEnabled` is true, the controller materializes an owned Domain that governs the certificate and DNS mapping chain for the host. See [Domain](domain.md).

`runtime`

Defines routing substrate.

Example:

```kubectl
runtime: kubernetes.io/container-runtime
```

This allows:

- Multi-runtime extension.
- Ingress abstraction.
- Gateway API integration.
- Service mesh integration.
- Runtime is explicit.
- Entropy Reduction at Exposure Layer.

Before Route:

- Workload may exist.
- Exposure may be implicit.
- Ingress rules may drift.

After Route:

- Host is declared
- TLS policy is explicit
- Path mapping is constrained
- Exposure enablement is governed
- External surface area is controlled.
- Entropy collapses at the edge.

## Reconciliation Responsibility

The Route controller is responsible for:

- Validating host uniqueness.
- Ensuring TLS configuration.
- Applying runtime routing objects.
- Surfacing exposure conflicts.
- Reflecting availability status.

It does not:

Deploy workloads
Modify artifacts
Bypass deployment contract
It governs external access.

## Design Principles

Exposure must be explicit

- TLS must be declared.
- Host identity must be constrained.
- Runtime must be abstracted.
- Public surface must be auditable.
- Route formalizes traffic governance.

### What This Enables

- Deterministic ingress management.
- Safe multi-environment routing.
- Controlled exposure rollout.
- TLS baseline enforcement.
- Structured external surface governance.
- Delivery is not complete until exposure is governed.
