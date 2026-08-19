# GitRepository

API Group: `sources.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

GitRepository defines a governed source origin for delivery.

It establishes provider configuration, webhook scope, and repository identity.

---

### Spec

| Field             | Type   | Required | Description                             |
| ------------------ | ------ | -------- | --------------------------------------- |
| provider          | string | Yes      | Source control provider (e.g. `github`) |
| repository.owner  | string | Yes      | Repository owner                        |
| repository.name   | string | Yes      | Repository name                         |
| webhooks          | list   | Yes      | Allowed webhook event configurations    |
| credentialsSecret | string | No       | Secret for repository authentication    |

---

#### spec.contract.webhooks[]

| Field  | Type     | Required | Description                                       |
| ------ | -------- | -------- | ------------------------------------------------- |
| events | string[] | Yes      | Allowed event types (e.g. `push`, `pull_request`) |

---

#### Status

| Field         | Type    | Description                                    |
| -------------- | ------- | -------------------------------------------------- |
| ready         | boolean | Whether the repository is registered and reachable |
| reason        | string  | Human-readable detail, populated on error          |
| lastUpdatedAt | string  | Timestamp when status was last updated             |

---

### Example

```yaml
apiVersion: sources.blanketops.dev/v1
kind: GitRepository
metadata:
  name: for-kaniko-app
  namespace: dev
spec:
  contract:
    provider: github
    repository:
      owner: example-org
      name: for-kaniko-app
    webhooks:
      - events:
          - push
          - pull_request
```
