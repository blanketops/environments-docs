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

| Field              | Type   | Required | Description                                                       |
| ------------------- | ------ | -------- | ------------------------------------------------------------------ |
| repository         | string | Yes      | Repository the event originated from, as `owner/name`             |
| eventType          | string | Yes      | Provider event type: `push`, `pull_request`, `release`, or `manual` |
| ref                | string | No       | Git ref the event applies to (e.g. `refs/heads/main`)              |
| commitSHA          | string | No       | Commit SHA at the head of the event                                |
| actor              | string | No       | Provider login of the actor who caused the event                   |
| eventId            | string | No       | Provider-assigned delivery ID, used for idempotency and audit      |
| occurredAt         | string | No       | Timestamp the provider reports the event occurred at               |
| webhookSecretRef   | string | No       | Name of the Secret holding the HMAC signing secret. Absent for manual dispatch |

Only `repository` and `eventType` are enforced today — everything else is read if present and left empty otherwise. A real webhook delivery populates `ref`, `commitSHA`, and `actor`; a manual dispatch can omit them.

`webhookSecretRef` names a Secret materialized via ExternalSecret from `/blanketops/github/webhook/secret` — see [Environment: Secrets & SecretStore](../Environments/environment.md#secrets--secretstore). It isn't created directly, and unlike most secret references in this platform it's a plain name, not a `{name, key}` pair — the signing value's key within that Secret is a platform convention, not something you set here.

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
    commitSHA: 3f2c91d
```

That's the manual dispatch path — useful for local testing before a webhook is wired up, and you choose the namespace.

**Real webhook deliveries land somewhere different.** GitRepository provisions an Argo Events `EventSource` + `Sensor` pair in the platform's own `argo-events` namespace, not the GitRepository's namespace. When GitHub actually delivers a webhook, that Sensor is what creates the resulting `GitHubEvent` — and it creates it in `argo-events`, populating `ref`, `commitSHA`, and `actor` from the payload:

```bash
kubectl get githubevents.events.blanketops.dev -n argo-events
```

Not `-n dev`. This is easy to miss the first time — see [Next Steps: Try a Real Webhook](../../Getting Started/next-steps.md).

With signature verification wired up (relevant to the manual-dispatch path above; the Sensor's own trigger doesn't set this):

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
    commitSHA: 3f2c91d
    webhookSecretRef: github-webhook-secret
```

`github-webhook-secret` here is materialized by the controller via `ExternalSecret`, sourced from `/blanketops/github/webhook/secret` in the environment's secret store — see [Environment: Secrets & SecretStore](../Environments/environment.md#secrets--secretstore). It isn't created directly.

---

### Invariants

- GitHubEvent is immutable once created — resubmit a new event rather than editing an existing one.
- `repository` must match a `repository.owner/repository.name` pair from an existing GitRepository.
- `eventType` must be one of the declared webhook events on the originating GitRepository.
- Webhook-delivered GitHubEvents are created in the platform's `argo-events` namespace, not the originating GitRepository's namespace.
