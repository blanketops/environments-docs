---
sidebar_position: 3
---

# Quickstart

The fastest way to confirm your install worked: create a namespace, an [Environment](../Api/Environments/environment.md), and a [GitRepository](../Api/Sources/gitrepository.md), and watch the controller pick them up.

This doesn't build or deploy anything yet — that's [First Delivery](./first-delivery.md). This just proves the operator is reconciling.

## 1. Create a Namespace

```bash
kubectl create namespace quickstart
```

## 2. Apply an Environment

```yaml title="environment.yaml"
apiVersion: environments.blanketops.dev/v1alpha1
kind: Environment
metadata:
  name: for-kaniko-app-main
  namespace: quickstart
spec:
  contract:
    applicationName: for-kaniko-app
    branch: main
    gitOwner: blanketops01
    environmentType: development
```

```bash
kubectl apply -f environment.yaml
```

## 3. Apply a GitRepository

```yaml title="gitrepository.yaml"
apiVersion: sources.blanketops.dev/v1alpha1
kind: GitRepository
metadata:
  name: for-kaniko-app
  namespace: quickstart
spec:
  contract:
    provider: github
    repository:
      owner: blanketops01
      name: for-kaniko-app
    webhooks:
      events:
        - push
        - pull_request
```

```bash
kubectl apply -f gitrepository.yaml
```

## 4. Watch It Reconcile

```bash
kubectl get environments.environments.blanketops.dev,gitrepositories.sources.blanketops.dev -n quickstart -w
```

You should see both objects pick up a `phase` within a few seconds — that's the controller-manager reconciling. Ctrl-C once you see status populate.

If nothing changes, the operator likely isn't running — go back to [Installation](./installation.md) and confirm `kubectl get pods -n blanketops-environments`.

Ready for the real thing: [First Delivery](./first-delivery.md).
