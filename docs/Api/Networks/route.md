# Route

API Group: `networks.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

Route defines the governed traffic exposure contract for a deployed ServiceUnit.

It specifies host binding, path mapping, TLS requirement, runtime substrate, and activation state.

Route abstracts ingress configuration into a deterministic exposure resource.

- Route does not deploy workloads.
- Route does not modify artifacts.
- Route does not manage certificates directly — when `tlsEnabled` is true, the controller materializes an owned [Domain](domain.md) resource to govern the TLS and DNS mapping chain for the host.
- Route governs external access.

---

### Spec

spec

---

| Field    | Type   | Required | Description               |
| -------- | ------ | -------- | ------------------------- |
| contract | object | Yes      | Traffic exposure contract |

---

#### spec.contract

| Field          | Type    | Required | Description                                   |
| -------------- | ------- | -------- | ---------------------------------------------- |
| host           | string  | Yes      | Fully qualified domain name                   |
| path           | string  | Yes      | HTTP path mapping                             |
| enabled        | boolean | Yes      | Whether route is active                       |
| tlsEnabled     | boolean | Yes      | Whether TLS is required                       |
| runtime        | string  | Yes      | Runtime routing substrate identifier          |
| serviceUnitRef | object  | Yes      | Reference to the ServiceUnit this route exposes |

---

#### spec.contract.serviceUnitRef

| Field | Type   | Required | Description                                    |
| ----- | ------ | -------- | ------------------------------------------------ |
| name  | string | Yes      | Name of the ServiceUnit CR in this namespace     |

The controller derives the materialized service/ksvc name by convention (`ksvc name == serviceUnitRef.name`) — no ServiceUnit status lookup is required.

---

### Status

| Field           | Type        | Description                         |
| ---------------- | ----------- | ------------------------------------ |
| phase           | string      | Current lifecycle phase             |
| message         | string      | Human-readable status detail        |
| resolvedAddress | string      | Address the route resolved to in runtime |
| tlsStatus       | string      | TLS provisioning state              |
| conditions      | []Condition | Standard Kubernetes condition array |

---

#### status.phase Values

| Value    | Meaning                                                              |
| -------- | ---------------------------------------------------------------------- |
| Pending  | Route accepted but not yet reconciled                                  |
| Ready    | Route materialized and serving traffic                                 |
| Degraded | Route materialized but not fully healthy (e.g. TLS not yet active)     |
| Failed   | Routing reconciliation error                                           |

---

#### status.tlsStatus Values

| Value        | Meaning                                          |
| ------------ | --------------------------------------------------- |
| Disabled     | TLS is not required for this route                   |
| Provisioning | Certificate issuance or DNS mapping is in progress   |
| Active       | Certificate is valid and traffic is served over TLS  |
| Failed       | Certificate issuance failed or expired               |

---

### Example

```yaml
apiVersion: networks.blanketops.dev/v1alpha1
kind: Route
metadata:
  name: route-sample
  namespace: dev
spec:
  contract:
    host: api.dev.example.com
    path: /
    enabled: true
    tlsEnabled: true
    runtime: kubernetes.io/container-runtime
    serviceUnitRef:
      name: for-kaniko-app-api
```

---

### Invariants

- host must be unique within the namespace (or cluster, depending on implementation).
- path must be valid HTTP path syntax.
- runtime must correspond to a supported routing implementation.
- Disabled routes are removed from the runtime, but the Route CR is retained.
- Route must reference an existing ServiceUnit in the same namespace.
- When tlsEnabled is true, an owned Domain resource governs certificate issuance and DNS mapping for the host.
