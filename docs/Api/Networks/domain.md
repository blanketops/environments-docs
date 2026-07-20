# Domain

API Group: `networks.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

Domain governs the TLS certificate and DNS mapping chain for a host exposed by a [Route](route.md).

It is owned by a Route via `ownerReference` and is cascade-deleted when that Route is deleted. Route owns workload binding (runtime, path, enabled); Domain owns the certificate and DNS mapping chain, and optional mTLS identity, for the host.

- Domain does not deploy workloads.
- Domain does not define path or runtime binding.
- Domain governs certificate issuance and DNS/host mapping only.

---

### Spec

spec

---

| Field    | Type   | Required | Description                  |
| -------- | ------ | -------- | ------------------------------ |
| contract | object | Yes      | Domain TLS/mapping contract    |

---

#### spec.contract

| Field       | Type    | Required | Description                                                    |
| ----------- | ------- | -------- | ------------------------------------------------------------------ |
| host        | string  | Yes      | Fully qualified domain name this Domain covers                     |
| routeRef    | object  | Yes      | Reference to the owning Route                                      |
| tlsStrategy | string  | Yes      | Certificate provisioning path: `platform` or `custom`              |
| mtls        | object  | No       | Inter-service mTLS configuration                                   |
| renewBefore | string  | No       | Cert renewal window, e.g. `720h` (custom strategy only)            |

---

#### spec.contract.routeRef

| Field | Type   | Required | Description                                       |
| ----- | ------ | -------- | ---------------------------------------------------- |
| name  | string | Yes      | Name of the owning Route CR (same namespace)         |

---

#### spec.contract.mtls

| Field    | Type    | Required | Description                                                                |
| -------- | ------- | -------- | ------------------------------------------------------------------------------ |
| enforced | boolean | No       | Whether blanketops-proxy sidecars and blanketK identities are wired for this host |

---

### Status

| Field            | Type        | Description                                              |
| ---------------- | ----------- | ------------------------------------------------------------ |
| phase            | string      | Current lifecycle phase                                      |
| message          | string      | Human-readable status detail                                 |
| certIssued       | boolean     | Whether a valid TLS certificate has been issued              |
| tlsStatus        | string      | TLS provisioning state                                       |
| domainReady      | boolean     | Whether cert and mapping are both reconciled and active      |
| certificateRef   | object      | Reference to the emitted Certificate (custom strategy only)  |
| domainMappingRef | object      | Reference to the emitted DomainMapping                       |
| conditions       | []Condition | Standard Kubernetes condition array                          |

---

#### status.phase Values

| Value        | Meaning                                                            |
| ------------ | ---------------------------------------------------------------------- |
| Pending      | Domain accepted but cert/mapping work has not started                  |
| Provisioning | Cert or DomainMapping is being provisioned                             |
| Ready        | Cert is issued, DomainMapping is active, host is reachable             |
| Failed       | Cert issuance failed, or an ACME HTTP01 challenge could not be satisfied |

---

#### status.tlsStatus Values

| Value        | Meaning                                                    |
| ------------ | --------------------------------------------------------------- |
| Disabled     | TLS is not configured for this domain                           |
| Provisioning | Cert issuance or DomainMapping creation is in progress           |
| Active       | Cert is valid and DomainMapping is serving TLS traffic           |
| Failed       | Cert issuance failed or the cert has expired                     |

---

### Example

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

Custom-zone example:

```yaml
apiVersion: networks.blanketops.dev/v1alpha1
kind: Domain
metadata:
  name: client-a-domain
spec:
  contract:
    host: app.client-a.co.za
    routeRef:
      name: route-client-a
    tlsStrategy: custom
    renewBefore: 720h
    mtls:
      enforced: true
```

---

### Invariants

- Domain must reference a Route in the same namespace via `routeRef`.
- Domain is cascade-deleted when the owning Route is deleted.
- `platform` strategy requires `host` to match the platform wildcard pattern; `custom` strategy accepts any client-owned FQDN.
- `renewBefore` applies only to `custom` strategy — platform wildcard certs renew on the platform schedule.
- `certificateRef` is set only for `custom` strategy.
- Domain is currently `v1alpha1` — the contract may change without backward-compatibility guarantees.
