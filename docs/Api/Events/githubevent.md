# GitHubEvent

API Group: `events.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

GitHubEvent represents a normalized, provider-derived event created from a validated GitRepository webhook.

It converts external webhook payloads into structured internal delivery state.

GitHubEvent is not a raw webhook payload.
It is a governed event object.

GitHubEvent is immutable once created.

---

### Spec

| Field         | Type   | Required | Description                                 |
| ------------- | ------ | -------- | ------------------------------------------- |
| repositoryRef | object | Yes      | Reference to the originating GitRepository  |
| eventType     | string | Yes      | Type of event (e.g. `push`, `pull_request`) |
| revision      | string | Yes      | Commit SHA associated with the event        |
| branch        | string | Yes      | Short branch name (e.g. `main`)             |
| rawRef        | string | No       | Full Git reference (e.g. `refs/heads/main`) |
| provider      | string | Yes      | Event source provider (e.g. `github`)       |

---

#### spec.repositoryRef

| Field | Type   | Required | Description                        |
| ----- | ------ | -------- | ---------------------------------- |
| name  | string | Yes      | Name of the GitRepository resource |

---

#### Status

| Field               | Type        | Description                                  |
| ------------------- | ----------- | -------------------------------------------- |
| phase               | string      | Lifecycle phase of the event                 |
| conditions          | []Condition | Standard Kubernetes condition array          |
| matchedBuildTrigger | string      | Name of BuildTrigger that matched this event |
| processedAt         | string      | Timestamp when event was evaluated           |

---

### Example

```yaml
apiVersion: sources.blanketops.dev/v1
kind: GitHubEvent
metadata:
  name: for-kaniko-app-3f2c91d
spec:
  contract:
    repositoryRef:
      name: for-kaniko-app
    eventType: push
    revision: 3f2c91d
    branch: main
    rawRef: refs/heads/main
```
