# Domain

The Domain represents the governed TLS certificate and DNS mapping chain for a host exposed by a Route.

It defines:

- Host binding (inherited from the owning Route).
- Certificate provisioning strategy.
- DNS/host mapping to the runtime.
- Optional mTLS identity for the host.

Domain is not a Route.

Domain is the declarative TLS and mapping contract that a Route delegates to.

### Position in Delivery

```mathematica
ServiceUnit → Deployment → Route → Domain
```

Where:

- ServiceUnit defines runtime workload.
- Deployment projects workload into environment.
- Route exposes workload to external traffic.
- Domain governs the certificate and DNS mapping chain for the Route's host.

Domain is owned by its Route via `ownerReference` — it cannot outlive it.

Why Domain Exists

Traditional systems bundle exposure and certificate management into a single ingress object:

- TLS provisioning is tangled with routing rules.
- Platform wildcard certs and client-owned zones are handled by inconsistent, ad hoc scripts.
- mTLS identity wiring is manual.
- Certificate renewal windows are undocumented tribal knowledge.

BlanketOps separates:

- Traffic exposure (Route).
- Certificate and mapping lifecycle (Domain).

This lets the platform apply two distinct provisioning paths without leaking that decision into the Route contract:

- `platform` — the platform wildcard cert already covers the host. The controller emits only a DomainClaim and DomainMapping.
- `custom` — a client-owned zone. The controller emits an Issuer, DomainClaim, DomainMapping, and Certificate, satisfying an HTTP01 ACME challenge.

Example (Contractual Form)

```yaml
apiVersion: networks.blanketops.dev/v1alpha1
kind: Domain
metadata:
  name: for-kaniko-app-domain
spec:
  contract:
    host: api.dev.blanketops.dev
    routeRef:
      name: route-sample
    tlsStrategy: platform
    mtls:
      enforced: false
```

Domain must be governed.

Not implied.

## Contract Semantics

The contract defines non-negotiable certificate and mapping boundaries.

`host`

Declares the fully qualified domain name this Domain covers.

Under `platform` strategy, this must match the platform wildcard pattern (e.g. `*.dev.blanketops.dev`).
Under `custom` strategy, this may be any client-owned FQDN.

`routeRef`

Binds this Domain to the Route that owns it.

- Route owns workload binding.
- Domain owns TLS and mapping.

Domain cannot exist without a resolvable Route in the same namespace.

`tlsStrategy`

Selects the certificate provisioning path.

Example:

```yaml
tlsStrategy: platform
```

This makes cert issuance:

- Explicit.
- Auditable.
- Strategy-scoped, not inferred from the host string.

`mtls`

Controls whether inter-service mTLS is enforced for this host.

When `enforced: true`:

- blanketops-proxy sidecars are injected.
- blanketK issues identities for workloads bound to this domain.
- The platform wires sidecar identity — no manual cert management required.

`renewBefore`

Controls cert-manager's renewal window for `custom` strategy certificates.

Platform wildcard certs are renewed on the platform schedule regardless of this field.

## Entropy Reduction at the Certificate Boundary

Before Domain:

- TLS provisioning is implicit in Route or ingress configuration.
- Platform and client-owned zones are handled by inconsistent, ad hoc paths.
- mTLS identity wiring is manual.

After Domain:

- Certificate strategy is declared.
- DNS mapping is a first-class, observable resource.
- mTLS enforcement is explicit.
- The Route's public surface and its TLS chain are governed independently, but neither exists without the other.

## Reconciliation Responsibility

The Domain controller is responsible for:

- Resolving the owning Route reference.
- Selecting the TLS provisioning path (platform or custom).
- Materializing DomainClaim and DomainMapping, and — for custom strategy — Issuer and Certificate.
- Wiring mTLS sidecar identity when enforced.
- Reflecting certificate and mapping status.

It does not:

- Define workload binding.
- Modify Route path or runtime configuration.
- Outlive its owning Route.

## Design Principles

- Certificate provisioning must be explicit.
- Platform and custom zones must follow distinct, declared paths.
- mTLS enforcement must be opt-in and visible.
- A Domain must never outlive the Route that owns it.
- Domain is the TLS truth boundary for a Route's host.

### What This Enables

- Deterministic certificate issuance across platform and client-owned zones.
- Safe mTLS rollout per host.
- Cascade-consistent cleanup — deleting a Route removes its Domain and certificates.
- Auditable TLS lifecycle, independent of routing logic.

Delivery is not exposed until its certificate chain is governed.
