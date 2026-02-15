# Deployment

API Group: `environments.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

Deployment defines the governed runtime projection of one or more ServiceUnits.

It binds resolved workload contracts to a runtime substrate and reconciliation strategy.

- Deployment does not build artifacts.
- Deployment does not expose traffic.
- Deployment governs runtime state projection.

### Spec

spec

| Field    | Type   | Required | Description                 |
| -------- | ------ | -------- | --------------------------- |
| contract | object | Yes      | Runtime projection contract |

---

#### spec.contract

| Field                  | Type     | Required | Description                                        |
| ---------------------- | -------- | -------- | -------------------------------------------------- |
| serviceUnits           | string[] | Yes      | Names of ServiceUnit resources to deploy           |
| runtime                | string   | Yes      | Runtime substrate identifier                       |
| imageAutomation        | boolean  | Yes      | Whether image updates are automatically reconciled |
| reconciliationStrategy | string   | Yes      | Strategy used to reconcile manifests               |
| manifestsRepo          | object   | Yes      | Git repository containing runtime manifests        |

---

#### spec.contract.manifestsRepo

| Field       | Type   | Required | Description                                    |
| ----------- | ------ | -------- | ---------------------------------------------- |
| url         | string | Yes      | Git repository URL containing manifests        |
| cloneSecret | string | No       | Secret used for Git authentication             |
| strategy    | string | Yes      | Reconciliation strategy (e.g. `kustomization`) |
| path        | string | Yes      | Path within repository to manifests            |

---

### Status

| Field               | Type        | Description                         |
| ------------------- | ----------- | ----------------------------------- |
| phase               | string      | Current lifecycle phase             |
| observedGeneration  | integer     | Last reconciled generation          |
| lastAppliedRevision | string      | Git revision currently applied      |
| conditions          | []Condition | Standard Kubernetes condition array |

---

#### status.phase Values

| Value       | Meaning                                  |
| ----------- | ---------------------------------------- |
| Pending     | Deployment registered but not reconciled |
| Reconciling | Applying manifests                       |
| Ready       | Runtime state matches desired contract   |
| Drifted     | Runtime state differs from desired state |
| Failed      | Reconciliation error occurred            |

---

### Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Deployment
metadata:
  name: for-kaniko-app
spec:
  contract:
    serviceUnits:
      - for-kaniko-app-api

    runtime: kubernetes.io/container-runtime

    imageAutomation: false

    reconciliationStrategy: kustomize

    manifestsRepo:
      url: git@github.com:ntlaletsi70/for-kaniko-app-deployment.git
      cloneSecret: git-ssh-credentials
      strategy: kustomization
      path: ./bases/kustomization.yaml
```
