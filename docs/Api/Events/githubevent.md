# GitHubEvent

API Group: `events.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

### Description

GitHubEvent represents a normalized, provider-derived event created from a validated GitRepository webhook.

It converts external webhook payloads into structured internal delivery state.

GitHubEvent is not a raw webhook payload.
It is a governed event object.

GitHubEvent is immutable once created.

---

### Contract

| Field         | Type   | Required | Description                                 |
| ------------- | ------ | -------- | ------------------------------------------- |
| repositoryRef | object | Yes      | Reference to the originating GitRepository  |
| eventType     | string | Yes      | Type of event (e.g. `push`, `pull_request`) |
| revision      | string | Yes      | Commit SHA associated with the event        |
| branch        | string | Yes      | Short branch name (e.g. `main`)             |
| rawRef        | string | No       | Full Git reference (e.g. `refs/heads/main`) |
| provider      | string | Yes      | Event source provider (e.g. `github`)       |

---

| Field | Type   | Required | Description                        |
| ----- | ------ | -------- | ---------------------------------- |
| name  | string | Yes      | Name of the GitRepository resource |
