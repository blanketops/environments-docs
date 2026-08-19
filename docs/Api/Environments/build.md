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

| Field          | Type     | Required | Description                              |
| -------------- | -------- | -------- | ----------------------------------------- |
| image          | string   | Yes      | Target container image reference          |
| strategy       | object   | Yes      | Execution strategy definition             |
| source         | object   | Yes      | Source repository configuration           |
| serviceAccount | object   | Yes      | Execution identity binding                |
| policy         | object   | No       | Trigger and retry policy configuration    |
| timeout        | duration | No       | Maximum duration for a single build run    |
| timeToLive     | duration | No       | How long to retain the BuildRun after completion |
| githubEvent    | string   | No       | Name of the triggering GitHubEvent CR, if build-triggered |

---

#### spec.contract.strategy

| Field | Type   | Required | Description                                 |
| ----- | ------ | -------- | ------------------------------------------- |
| kind  | string | Yes      | Strategy type (e.g. `ClusterBuildStrategy`) |
| name  | string | Yes      | Name of strategy resource                   |

---

#### spec.contract.source

| Field       | Type    | Required | Description                          |
| ----------- | ------- | -------- | ------------------------------------ |
| url         | string  | Yes      | Git repository URL                   |
| revision    | string  | Yes      | Branch, tag, or commit reference     |
| contextDir  | string  | Yes      | Build context directory              |
| depth       | integer | No       | Git clone depth (shallow clone); 0 means full history |
| sslVerify   | boolean | No       | Whether to verify SSL certs when cloning over HTTPS |
| cloneSecret | string  | No       | Secret for repository authentication |

---

#### spec.contract.serviceAccount

| Field  | Type   | Required | Description                            |
| ------ | ------ | -------- | -------------------------------------- |
| name   | string | Yes      | Kubernetes ServiceAccount name         |
| secret | string | No       | Secret containing registry credentials |

---

#### spec.contract.policy

| Field           | Type     | Required | Description           |
| --------------- | -------- | -------- | --------------------- |
| allowedTriggers  | []object | No       | Allowed trigger types |
| retry           | object   | No       | Retry configuration   |

---

#### spec.contract.policy.allowedTriggers[]

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

| Field          | Type   | Description                                |
| -------------- | ------ | -------------------------------------------- |
| phase          | string | Current lifecycle phase                       |
| image          | string | Produced image reference, once known          |
| executionRef   | string | Name of the underlying Shipwright BuildRun    |
| message        | string | Human-readable status detail                   |
| startTime      | string | Execution start timestamp                      |
| completionTime | string | Execution completion timestamp                 |

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
  namespace: dev
spec:
  contract:
    image: docker.io/example/for-kaniko-app:master
    strategy:
      kind: ClusterBuildStrategy
      name: kaniko
    source:
      url: git@github.com:example-org/for-kaniko-app.git
      revision: master
      contextDir: .
      cloneSecret: git-ssh-credentials
    serviceAccount:
      name: build-bot
      secret: registry-credentials
    policy:
      allowedTriggers:
        - type: push
        - type: pull_request
```

---

### Invariants

- image must be a valid container image reference.
- strategy.kind must correspond to a registered build strategy.
- source.revision must be resolvable.
- serviceAccount.name must exist in the namespace.
- status.image is set once the build completes and does not change afterward.
- Build does not modify Deployment or Route resources.
