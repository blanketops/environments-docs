# BuildTrigger

API Group: `environments.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

BuildTrigger defines the policy boundary between an incoming GitHubEvent and a Build execution.

It evaluates event eligibility and determines whether a Build should be triggered.

BuildTrigger does not execute builds.
It authorizes them.

---

### Spec

| Field    | Type   | Required | Description                 |
| -------- | ------ | -------- | --------------------------- |
| contract | object | Yes      | Trigger evaluation contract |

---

#### spec.contract

| Field         | Type   | Required | Description                                     |
| ------------- | ------ | -------- | ----------------------------------------------- |
| source        | string | Yes      | Event provider (e.g. `github`)                  |
| eventType     | string | Yes      | Event type to match (e.g. `push`)               |
| repository    | object | Yes      | Repository identity filter                      |
| ref           | string | Yes      | Git reference to match (e.g. `refs/heads/main`) |
| buildRef      | object | Yes      | Target Build reference                          |
| payloadPolicy | object | No       | Payload exposure configuration                  |

---

#### spec.contract.repository

| Field | Type   | Required | Description      |
| ----- | ------ | -------- | ---------------- |
| owner | string | Yes      | Repository owner |
| name  | string | Yes      | Repository name  |

---

#### spec.contract.buildRef

| Field | Type   | Required | Description                       |
| ----- | ------ | -------- | --------------------------------- |
| name  | string | Yes      | Name of Build resource to trigger |

---

#### spec.contract.payloadPolicy

| Field | Type    | Required | Description                              |
| ----- | ------- | -------- | ---------------------------------------- |
| allow | boolean | No       | Whether to expose event payload to Build |

---

### Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: BuildTrigger
metadata:
  name: github-push-main
spec:
  contract:
    source: github
    eventType: push
    repository:
      owner: blanketops01
      name: for-kaniko-app
    ref: refs/heads/main
    buildRef:
      name: build-sample-kaniko
    payloadPolicy:
      allow: true
```
