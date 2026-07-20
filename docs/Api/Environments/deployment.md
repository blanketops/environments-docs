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

| Field                  | Type     | Required                              | Description                                        |
| ---------------------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| serviceUnits           | string[] | Yes                                       | Names of ServiceUnit resources to deploy           |
| runtime                | string   | Yes                                       | Runtime substrate identifier                       |
| strategy               | string   | Yes                                       | Rollout strategy: `Rolling`, `BlueGreen`, or `Canary` |
| imageAutomation        | boolean  | No                                        | Whether image updates are automatically reconciled |
| gitOwner               | string   | No                                        | Owning Git organisation or user                    |
| reconciliationStrategy | string   | Yes, if `manifestsRepo` is set            | Strategy used to reconcile manifests: `kustomize` or `helm`. Must be absent if `manifestsRepo` is not set — defaults to imperative reconciliation |
| manifestsRepo          | object   | No                                        | Git repository containing runtime manifests        |

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

| Value     | Meaning                                          |
| --------- | --------------------------------------------------- |
| Pending   | Waiting for service units or GitOps sources to be ready |
| Deploying | Workloads are being rolled out                        |
| Ready     | All service units are deployed and healthy             |
| Failed    | One or more service units failed to deploy              |

---

### Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Deployment
metadata:
  name: for-kaniko-app
  namespace: dev
spec:
  contract:
    serviceUnits:
      - for-kaniko-app-api
    runtime: kubernetes.io/container-runtime
    strategy: Rolling
    imageAutomation: false
    reconciliationStrategy: kustomize
    manifestsRepo:
      url: git@github.com:example-org/for-kaniko-app-deployment.git
      cloneSecret: git-ssh-credentials
      strategy: kustomization
      path: ./bases/kustomization.yaml
```

---

## Invariants

- All referenced ServiceUnits must exist.
- runtime must be supported by the controller.
- manifestsRepo.url must be reachable.
- path must resolve to valid manifests.
- imageAutomation must not override ServiceUnit contract constraints.
- Deployment does not modify Build resources.
