# Build

API Group: `environments.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

Build represents the deterministic transformation of governed source into a container image artifact.

It defines artifact destination, execution strategy, source configuration, identity binding, and execution policy.

Build objects are responsible for producing a verifiable image artifact

---

### Spec

| Field    | Type   | Required | Description              |
| -------- | ------ | -------- | ------------------------ |
| contract | object | Yes      | Build execution contract |

---

#### spec.contract

| Field          | Type   | Required | Description                            |
| -------------- | ------ | -------- | -------------------------------------- |
| image          | string | Yes      | Target container image reference       |
| strategy       | object | Yes      | Execution strategy definition          |
| source         | object | Yes      | Source repository configuration        |
| serviceAccount | object | Yes      | Execution identity binding             |
| policy         | object | No       | Trigger and retry policy configuration |

---

#### spec.contract.strategy

| Field | Type   | Required | Description                                 |
| ----- | ------ | -------- | ------------------------------------------- |
| kind  | string | Yes      | Strategy type (e.g. `ClusterBuildStrategy`) |
| name  | string | Yes      | Name of strategy resource                   |

---

#### spec.contract.source

| Field       | Type   | Required | Description                          |
| ----------- | ------ | -------- | ------------------------------------ |
| url         | string | Yes      | Git repository URL                   |
| revision    | string | Yes      | Branch, tag, or commit reference     |
| contextDir  | string | Yes      | Build context directory              |
| cloneSecret | string | No       | Secret for repository authentication |

---

#### spec.contract.serviceAccount

| Field  | Type   | Required | Description                            |
| ------ | ------ | -------- | -------------------------------------- |
| name   | string | Yes      | Kubernetes ServiceAccount name         |
| secret | string | No       | Secret containing registry credentials |

---

#### spec.contract.policy

| Field    | Type     | Required | Description           |
| -------- | -------- | -------- | --------------------- |
| triggers | []object | No       | Allowed trigger types |
| retry    | object   | No       | Retry configuration   |

---

#### spec.contract.policy.triggers[]

| Field | Type   | Required | Description                                      |
| ----- | ------ | -------- | ------------------------------------------------ |
| type  | string | Yes      | Allowed event type (e.g. `push`, `pull_request`) |

---

#### spec.contract.policy.retry

| Field       | Type    | Required | Description            |
| ----------- | ------- | -------- | ---------------------- |
| onFailure   | boolean | No       | Retry on failure       |
| maxAttempts | integer | No       | Maximum retry attempts |

---

### Status

| Field          | Type        | Description                         |
| -------------- | ----------- | ----------------------------------- |
| phase          | string      | Current lifecycle phase             |
| artifactDigest | string      | Produced image digest               |
| startTime      | string      | Execution start timestamp           |
| completionTime | string      | Execution completion timestamp      |
| conditions     | []Condition | Standard Kubernetes condition array |

---

#### status.phase Values

| Value     | Meaning                              |
| --------- | ------------------------------------ |
| Pending   | Build registered but not yet started |
| Running   | Build execution in progress          |
| Succeeded | Artifact successfully produced       |
| Failed    | Build execution failed               |

---

### Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Build
metadata:
  name: for-kaniko-app
spec:
  contract:
    image: docker.io/nkanyezisolutions/for-kaniko-app:master
    strategy:
      kind: ClusterBuildStrategy
      name: kaniko
    source:
      url: git@github.com:blanketops01/for-kaniko-app.git
      revision: master
      contextDir: .
      cloneSecret: git-ssh-credentials
    serviceAccount:
      name: build-bot
      secret: registry-credentials
    policy:
      triggers:
        - type: push
        - type: pull_request
```

---

### Invariants

- image must be a valid container image reference.
- strategy.kind must correspond to a registered build strategy.
- source.revision must be resolvable.
- serviceAccount.name must exist in the namespace.
- artifactDigest is immutable once set.
- Build does not modify Deployment or Route resources.
