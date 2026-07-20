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

GitHubEvent is immutable once created — the controller writes status, never the spec.

---

### Spec

| Field      | Type   | Required | Description                                                       |
| ---------- | ------ | -------- | ------------------------------------------------------------------ |
| repository | string | Yes      | Repository the event originated from, as `owner/name`             |
| eventType  | string | Yes      | Provider event type: `push`, `pull_request`, `release`, or `manual` |
| ref        | string | Yes      | Git ref the event applies to (e.g. `refs/heads/main`)              |
| commitSha  | string | Yes      | Commit SHA at the head of the event                                |
| actor      | string | No       | Provider login of the actor who caused the event                   |
| eventId    | string | No       | Provider-assigned delivery ID, used for idempotency and audit      |
| occurredAt | string | No       | Timestamp the event occurred on the provider                       |
| webhook    | object | No       | Webhook signature verification config. Absent for manual dispatch  |

---

#### spec.contract.webhook

| Field    | Type   | Required | Description                                          |
| -------- | ------ | -------- | ------------------------------------------------------- |
| secretRef | object | Yes, if `webhook` is set | Reference to the Secret holding the HMAC signing secret |

#### spec.contract.webhook.secretRef

| Field | Type   | Required | Description                                                     |
| ----- | ------ | -------- | ------------------------------------------------------------------ |
| name  | string | Yes      | Name of the Secret — materialized via ExternalSecret from `/blanketops/github/webhook/secret` |
| key   | string | Yes      | Key within that Secret holding the signing value                    |

---

#### Status

| Field        | Type        | Description                                                         |
| ------------ | ----------- | --------------------------------------------------------------------- |
| phase        | string      | Lifecycle phase of the event                                          |
| conditions   | []Condition | Standard Kubernetes condition array                                   |
| accepted     | boolean     | Whether the event passed signature verification and contract match    |
| triggered    | boolean     | Whether the event triggered a Build                                   |
| triggeredRef | string      | Name of the Build CR triggered by this event, if any                  |
| reason       | string      | Human-readable reason if not accepted or not triggered                |
| processedAt  | string      | Timestamp when event was evaluated                                    |

---

#### status.phase Values

| Value   | Meaning                                  |
| ------- | ------------------------------------------- |
| Pending | Event recorded, not yet evaluated            |
| Ready   | Event evaluated — see `accepted`/`triggered` for outcome |
| Failed  | Evaluation could not complete                |

---

### Example

```yaml
apiVersion: events.blanketops.dev/v1alpha1
kind: GitHubEvent
metadata:
  name: for-kaniko-app-3f2c91d
  namespace: dev
spec:
  contract:
    repository: example-org/for-kaniko-app
    eventType: push
    ref: refs/heads/main
    commitSha: 3f2c91d
```

Delivered webhooks arrive through the platform-generated `GitHubPayload` object, not this one — `GitHubEvent` is the user-facing surface. Creating one directly (as above) is the manual dispatch path: useful for local testing before a webhook is wired up.

With signature verification wired up:

```yaml
apiVersion: events.blanketops.dev/v1alpha1
kind: GitHubEvent
metadata:
  name: for-kaniko-app-3f2c91d
  namespace: dev
spec:
  contract:
    repository: example-org/for-kaniko-app
    eventType: push
    ref: refs/heads/main
    commitSha: 3f2c91d
    webhook:
      secretRef:
        name: github-webhook-secret
        key: secret
```

`github-webhook-secret` here is materialized by the controller via `ExternalSecret`, sourced from `/blanketops/github/webhook/secret` in your environment's secret store — see [Environment: Secrets & SecretStore](../Environments/environment.md#secrets--secretstore). You don't create it directly.

---

### Invariants

- GitHubEvent is immutable once created — resubmit a new event rather than editing an existing one.
- `repository` must match a `repository.owner/repository.name` pair from an existing GitRepository in the namespace.
- `eventType` must be one of the declared webhook events on the originating GitRepository.
