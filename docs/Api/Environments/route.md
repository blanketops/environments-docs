# Route

API Group: `environments.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

Route defines the governed traffic exposure contract for a deployed workload.

It specifies host binding, path mapping, TLS policy, runtime substrate, and activation state.

Route abstracts ingress configuration into a deterministic exposure resource.

- Route does not deploy workloads.
- Route does not modify artifacts.
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

| Field      | Type    | Required | Description                          |
| ---------- | ------- | -------- | ------------------------------------ |
| host       | string  | Yes      | Fully qualified domain name          |
| path       | string  | Yes      | HTTP path mapping                    |
| enabled    | boolean | Yes      | Whether route is active              |
| tlsEnabled | boolean | Yes      | Whether TLS is required              |
| runtime    | string  | Yes      | Runtime routing substrate identifier |

---

### Status

| Field        | Type        | Description                         |
| ------------ | ----------- | ----------------------------------- |
| phase        | string      | Current lifecycle phase             |
| resolvedHost | string      | Host applied in runtime             |
| tlsStatus    | string      | TLS provisioning state              |
| conditions   | []Condition | Standard Kubernetes condition array |

---

#### status.phase Values

| Value       | Meaning                             |
| ----------- | ----------------------------------- |
| Pending     | Route registered but not reconciled |
| Reconciling | Applying routing configuration      |
| Active      | Route successfully applied          |
| Disabled    | Route disabled by contract          |
| Failed      | Routing reconciliation error        |

---

### Example

```yaml
apiVersion: environments.blanketops.dev/v1
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

---

### Invariants

- host must be unique within the namespace (or cluster, depending on implementation).
- path must be valid HTTP path syntax.
- runtime must correspond to a supported routing implementation.
- Disabled routes must not expose traffic.
- Route must not exist without a corresponding deployed ServiceUnit.
- TLS enforcement must match runtime capability.
