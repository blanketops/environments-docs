# Package

API Group: `environments.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

Description

Package defines a versioned, distributable configuration unit for a delivery workload.

It encapsulates metadata, ownership, repository source, and environment state projection rules.

Package governs configuration distribution, not artifact creation.

---

### Spec

spec

| Field    | Type   | Required | Description                 |
| -------- | ------ | -------- | --------------------------- |
| contract | object | Yes      | Package definition contract |

---

#### spec.contract

| Field           | Type     | Required | Description                                  |
| ---------------- | -------- | -------- | --------------------------------------------- |
| enabled         | boolean  | Yes      | Whether the package is active                 |
| name            | string   | Yes      | Canonical package identity                    |
| version         | string   | Yes      | Logical version identifier                    |
| description     | string   | No       | Human-readable description                    |
| maintainers     | []object | No       | List of maintainers                           |
| repository      | object   | Yes      | Source repository for package configuration   |
| diffEnabled     | boolean  | No       | Enables structured diff behavior               |
| stateRepository | object   | Yes      | Environment state repository definition        |

---

#### spec.contract.maintainers[]

| Field | Type   | Required | Description      |
| ----- | ------ | -------- | ---------------- |
| name  | string | Yes      | Maintainer name  |
| email | string | Yes      | Maintainer email |

---

#### spec.contract.repository

| Field             | Type   | Required | Description                          |
| ----------------- | ------ | -------- | ------------------------------------ |
| url               | string | Yes      | Git repository URL                   |
| credentialsSecret | string | No       | Secret for repository authentication |

---

#### spec.contract.stateRepository

| Field       | Type   | Required | Description                                    |
| ----------- | ------ | -------- | ---------------------------------------------- |
| url         | string | Yes      | Git repository URL for state projection        |
| ref         | string | Yes      | Git branch, tag, or commit reference            |
| cloneSecret | string | No       | Secret for repository authentication           |
| strategy    | string | Yes      | Reconciliation strategy (e.g. `kustomization`) |
| path        | string | Yes      | Path within repository for state projection    |

---

### Status

| Field               | Type        | Description                         |
| ------------------- | ----------- | ----------------------------------- |
| phase               | string      | Current lifecycle phase             |
| observedVersion     | string      | Version currently reconciled        |
| lastAppliedRevision | string      | Git revision currently applied      |
| conditions          | []Condition | Standard Kubernetes condition array |

---

#### status.phase Values

| Value       | Meaning                               |
| ----------- | ------------------------------------- |
| Pending     | Package registered but not reconciled |
| Reconciling | Synchronizing configuration           |
| Ready       | Package state aligned with contract   |
| Disabled    | Package disabled by contract          |
| Failed      | Reconciliation failure                |

---

### Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Package
metadata:
  name: for-kaniko-app
  namespace: dev
spec:
  contract:
    enabled: true
    name: for-kaniko-app
    version: v1.2.3
    description: >
      This package contains the API deployment manifests and runtime configuration.
    maintainers:
      - name: Jane Doe
        email: jane@example.com
    repository:
      url: git@github.com:example-org/for-kaniko-app-packages.git
      credentialsSecret: git-ssh-credentials-packages
    diffEnabled: true
    stateRepository:
      url: git@github.com:example-org/for-kaniko-app-state.git
      ref: master
      cloneSecret: git-ssh-credentials-state
      strategy: kustomization
      path: ./clusters/dev
```

## Invariants

- name and version must remain consistent for a given package lifecycle.
- repository.url must be reachable.
- stateRepository.url must be reachable.
- stateRepository.path must resolve to valid manifests.
- Disabled packages must not reconcile state.
- Package does not modify Build or Deployment resources directly.
