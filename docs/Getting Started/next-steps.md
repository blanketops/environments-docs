---
sidebar_position: 6
---

# Next Steps

You've installed the platform and run one application through the full delivery chain. From here:

## Understand the Model

- [Delivery as Deterministic State](../Model/state-machine.md) — why BlanketOps models delivery as state, not pipeline steps.
- [Entropy in Software Delivery](../Model/entropy.md) — how each resource narrows the space of possible outcomes.
- [Why Delivery Drifts](../Why/delivery-drifts.md) — the failure modes this design avoids.

## Go Deeper on Each Resource

Every resource in the chain has a concept page (the why) and an API reference (the contract):

| Resource | Concept | API Reference |
| -------- | ------- | -------------- |
| Environment | [Concept](../Concepts/environment.md) | [Reference](../Api/Environments/environment.md) |
| GitRepository | [Concept](../Concepts/gitrepository.md) | [Reference](../Api/Sources/gitrepository.md) |
| GitHubEvent | [Concept](../Concepts/githubevent.md) | [Reference](../Api/Events/githubevent.md) |
| Build | [Concept](../Concepts/build.md) | [Reference](../Api/Environments/build.md) |
| ServiceUnit | [Concept](../Concepts/serviceunit.md) | [Reference](../Api/Environments/serviceunit.md) |
| Deployment | [Concept](../Concepts/deployment.md) | [Reference](../Api/Environments/deployment.md) |
| Route | [Concept](../Concepts/route.md) | [Reference](../Api/Networks/route.md) |
| Domain | [Concept](../Concepts/domain.md) | [Reference](../Api/Networks/domain.md) |

## Try a Real Webhook

[First Delivery](./first-delivery.md) created its `GitHubEvent` manually. In practice, point a GitHub webhook at the `hookUrl` you declared on your `GitRepository` and pushes will create `GitHubEvent` objects — and trigger Builds — on their own.

## Wire In a Second Environment

Create a second `Environment` for the same `applicationName` with a different `branch` and `environmentType` (e.g. `staging`) to see environment isolation in practice — nothing is shared between them except the underlying platform.

## Uninstalling

```bash
bops-env dependencies uninstall
bops-env uninstall
bops-env cluster down dev   # if you created a local Kind cluster
```
