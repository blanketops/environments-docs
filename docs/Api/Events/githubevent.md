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
