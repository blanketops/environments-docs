# Service Unit

API Group: `environments.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

ServiceUnit defines the runtime workload contract for a delivery artifact.

It specifies artifact source, scaling boundaries, port exposure, application role, and stack classification.

- ServiceUnit abstracts workload identity from deployment strategy.
- ServiceUnit does not reconcile manifests directly.
- ServiceUnit defines workload shape.

---

### Spec

spec

| Field    | Type   | Required | Description                  |
| -------- | ------ | -------- | ---------------------------- |
| contract | object | Yes      | Workload definition contract |

---

#### spec.contract

| Field         | Type    | Required | Description                                                |
| ------------- | ------- | -------- | ---------------------------------------------------------- |
| type          | string  | Yes      | Artifact origin type (`static` or `build`)                 |
| image         | string  | Cond.    | Container image reference (required if `type=static`)      |
| buildRef      | object  | Cond.    | Reference to Build (required if `type=build`)              |
| containerPort | integer | Yes      | Primary container TCP port                                 |
| size          | integer | Yes      | Desired replica count baseline                             |
| appType       | string  | Yes      | Application role classification (`web`, `worker`, etc.)    |
| stackType     | string  | Yes      | Technology stack classification (`nodejs`, `python`, etc.) |

---

#### spec.contract.buildRef

| Field | Type   | Required | Description                 |
| ----- | ------ | -------- | --------------------------- |
| name  | string | Yes      | Name of referenced Build CR |

---

### Status

| Field         | Type        | Description                         |
| ------------- | ----------- | ----------------------------------- |
| phase         | string      | Current lifecycle phase             |
| observedImage | string      | Resolved image reference in runtime |
| conditions    | []Condition | Standard Kubernetes condition array |

---

#### status.phase Values

| Value    | Meaning                                      |
| -------- | -------------------------------------------- |
| Pending  | ServiceUnit registered but not yet projected |
| Resolved | Artifact reference successfully resolved     |
| Ready    | Successfully projected into a Deployment     |
| Failed   | Resolution or projection failed              |

---

### Examples

#### Static Artifact

```yaml
apiVersion: environments.blanketops.dev/v1
kind: ServiceUnit
metadata:
  name: for-kaniko-app-api
spec:
  contract:
    type: static
    image: docker.io/nkanyezisolutions/for-kaniko-app:master
    containerPort: 8080
    size: 2
    appType: web
    stackType: nodejs
```

#### Build-Derived Artifact

```yaml
apiVersion: environments.blanketops.dev/v1
kind: ServiceUnit
metadata:
  name: for-buildah-app-worker
spec:
  contract:
    type: build
    buildRef:
      name: for-buildah-app
    containerPort: 9000
    size: 1
    appType: worker
    stackType: python
```

### Invariants

- If `type=static`, `image` must be specified and `buildRef` must not be set.
- If `type=build`, `buildRef` must reference an existing Build and image must not be set.
- `containerPort` must be a valid TCP port.
- `size` must be greater than zero.
- ServiceUnit does not create Deployment resources automatically.
- ServiceUnit must be referenced by a Deployment to be projected into runtime
