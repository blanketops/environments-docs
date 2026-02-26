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

| Field              | Type     | Required | Description                                 |
| ------------------ | -------- | -------- | ------------------------------------------- |
| name               | string   | Yes      | Canonical package identity                  |
| version            | string   | Yes      | Logical version identifier                  |
| enabled            | boolean  | Yes      | Whether the package is active               |
| packageName        | string   | Yes      | Distribution name                           |
| packageVersion     | string   | Yes      | Distribution version                        |
| packageDescription | string   | No       | Human-readable description                  |
| packageMaintainers | []object | No       | List of maintainers                         |
| packageRepository  | object   | Yes      | Source repository for package configuration |
| packageKappDiff    | boolean  | No       | Enables structured diff behavior            |
| stateRepo          | object   | Yes      | Environment state repository definition     |

---

#### spec.contract.packageMaintainers[]

| Field | Type   | Required | Description      |
| ----- | ------ | -------- | ---------------- |
| name  | string | Yes      | Maintainer name  |
| email | string | Yes      | Maintainer email |

---

#### spec.contract.packageRepository

| Field             | Type   | Required | Description                          |
| ----------------- | ------ | -------- | ------------------------------------ |
| url               | string | Yes      | Git repository URL                   |
| credentialsSecret | string | No       | Secret for repository authentication |

---

#### spec.contract.stateRepo

| Field       | Type   | Required | Description                                    |
| ----------- | ------ | -------- | ---------------------------------------------- |
| url         | string | Yes      | Git repository URL for state projection        |
| ref         | object | Yes      | Git reference configuration                    |
| cloneSecret | string | No       | Secret for repository authentication           |
| strategy    | string | Yes      | Reconciliation strategy (e.g. `kustomization`) |
| path        | string | Yes      | Path within repository for state projection    |

---

#### spec.contract.stateRepo.ref

| Field  | Type   | Required | Description     |
| ------ | ------ | -------- | --------------- |
| branch | string | Yes      | Git branch name |

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
apiVersion: environments.blanketops.dev/v1
kind: Package
metadata:
name: for-kaniko-app
spec:
contract:
name: for-kaniko-app
version: v1.0.0
enabled: true

    packageName: for-kaniko-app
    packageVersion: v1.2.3

    packageDescription: >
      This package contains the API deployment manifests and runtime configuration.

    packageMaintainers:
      - name: Neo
        email: neo@blanketops.online

    packageRepository:
      url: git@github.com:blanketops01/for-kaniko-app-packages.git
      credentialsSecret: git-ssh-credentials-packages

    packageKappDiff: true

    stateRepo:
      url: git@github.com:blanketops01/for-kaniko-app-state.git
      ref:
        branch: master
      cloneSecret: git-ssh-credentials-state
      strategy: kustomization
      path: ./clusters/dev
```

## Invariants

- name and version must remain consistent for a given package lifecycle.
- packageRepository.url must be reachable.
- stateRepo.url must be reachable.
- stateRepo.path must resolve to valid manifests.
- Disabled packages must not reconcile state.
- Package does not modify Build or Deployment resources directly.
