# GitRepository

API Group: `sources.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

### Description

GitRepository defines a governed source origin for delivery.

It establishes provider configuration, webhook scope, and repository identity.

---

### Contract

| Field            | Type   | Required | Description                             |
| ---------------- | ------ | -------- | --------------------------------------- |
| provider         | string | Yes      | Source control provider (e.g. `github`) |
| hookUrl          | string | No       | Webhook endpoint for event ingestion    |
| repository.owner | string | Yes      | Repository owner                        |
| repository.name  | string | Yes      | Repository name                         |
| webhooks         | list   | Yes      | Allowed webhook event configurations    |

---

| Field  | Type     | Required | Description                                       |
| ------ | -------- | -------- | ------------------------------------------------- |
| events | string[] | Yes      | Allowed event types (e.g. `push`, `pull_request`) |

---

### Status

`status.phase`

Represents repository registration state.

Possible values:

- Pending

- Ready

- Faileds

---

`status.conditions`

Standard Kubernetes-style condition array.

---

### Example

```yaml
apiVersion: sources.blanketops.dev/v1
kind: GitRepository
metadata:
  name: for-kaniko-app
spec:
  contract:
    provider: github
    repository:
      owner: ntlaletsi70
      name: for-kaniko-app
    webhooks:
      - events:
          - push
          - pull_request
```
