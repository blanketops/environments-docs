---
sidebar_position: 5
---

# Verify

Every BlanketOps resource is a CRD, so the whole delivery chain from [First Delivery](./first-delivery.md) is inspectable with `kubectl get` — no CI dashboard, no log tailing.

Some of these plural names collide with resources from other operators installed alongside the platform (Shipwright's own `Build`, Kubernetes' own `Deployment`). Qualify with the API group to be unambiguous:

```bash
kubectl get environments.environments.blanketops.dev -n for-kaniko-app
kubectl get gitrepositories.sources.blanketops.dev -n for-kaniko-app
kubectl get githubevents.events.blanketops.dev -n for-kaniko-app
kubectl get builds.environments.blanketops.dev -n for-kaniko-app
kubectl get serviceunits.environments.blanketops.dev -n for-kaniko-app
kubectl get deployments.environments.blanketops.dev -n for-kaniko-app
kubectl get routes.networks.blanketops.dev -n for-kaniko-app
kubectl get domains.networks.blanketops.dev -n for-kaniko-app
```

Or watch everything reconcile at once:

```bash
kubectl get environments.environments.blanketops.dev,gitrepositories.sources.blanketops.dev,githubevents.events.blanketops.dev,builds.environments.blanketops.dev,serviceunits.environments.blanketops.dev,deployments.environments.blanketops.dev,routes.networks.blanketops.dev,domains.networks.blanketops.dev -n for-kaniko-app -w
```

## What "Done" Looks Like

| Resource      | Ready when `status.phase` is |
| -------------- | ------------------------------ |
| Environment    | `Ready`                        |
| GitRepository  | webhook registered, no error condition |
| GitHubEvent    | `Ready`, with `status.triggered: true` |
| Build          | the produced `BuildRun` completes; see [Build](../Api/Environments/build.md) |
| ServiceUnit    | artifact resolved, workload contract valid |
| Deployment     | manifests reconciled, no drift |
| Route          | `Ready`                        |
| Domain         | `Ready`, with `status.certIssued: true` |

Full phase value tables live on each resource's [API reference](../Api/overview.md) page.

## Digging Into One Resource

```bash
kubectl describe environment.environments.blanketops.dev for-kaniko-app-main -n for-kaniko-app
```

`status.conditions` on the Environment aggregates per-resource readiness (`BuildReady`, `DeploymentReady`, `RouteReady`, ...) — check there first if the top-level phase is stuck on `Pending` or `Degraded`, then drill into whichever condition is `False`.

If Build or GitHubEvent are stuck `Pending`, check their `ExternalSecret` before anything else — a remote key missing from your secret backend (see [Environment: Secrets & SecretStore](../Api/Environments/environment.md#secrets--secretstore)) surfaces there first:

```bash
kubectl get externalsecrets -n for-kaniko-app
kubectl describe externalsecret git-ssh-credentials -n for-kaniko-app
```

## Reaching the Workload

Once Route and Domain both report `Ready`:

```bash
curl https://api.dev.blanketops.dev/
```

## Tearing Down

Deleting the Environment cascades to every resource it owns:

```bash
kubectl delete environment.environments.blanketops.dev for-kaniko-app-main -n for-kaniko-app
```

Continue to [Next Steps](./next-steps.md).
