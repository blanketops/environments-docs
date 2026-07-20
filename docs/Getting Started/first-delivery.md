---
sidebar_position: 4
---

# First Delivery

A complete walkthrough of the delivery chain, end to end: source → build → workload → runtime → traffic → TLS.

We'll deliver the same example application used throughout these docs — [`for-kaniko-app`](https://github.com/blanketops01/for-kaniko-app), built with the `kaniko` Shipwright strategy.

Every resource below is namespaced and belongs to one [Environment](../Api/Environments/environment.md), which owns them all via `ownerReference`.

## 0. Namespace and Secrets

```bash
kubectl create namespace for-kaniko-app
```

You will **not** `kubectl create secret` anything for this walkthrough. Build's Git clone key and registry push credential are pulled automatically by the controller via `ExternalSecret`, from whichever backend the Environment's `contract.secretStore.provider` points at (step 1 below).

That does assume a `ClusterSecretStore` named `blanketops-environments-aws` (or `-vault`/`-gcp`/`-azure`) already exists on the cluster, pointed at your actual secret manager — that's cluster infrastructure, not something this walkthrough or the Environment controller creates. See [Environment: Secrets & SecretStore](../Api/Environments/environment.md#secrets--secretstore) for a minimal example.

With that store in place, before applying the `Build` in step 4, these remote keys need a value in it —

| Remote key                       | Backs                                    |
| ---------------------------------- | ------------------------------------------- |
| `/blanketops/git/ssh-privatekey`   | Git SSH clone key (`ssh-privatekey`)        |
| `/blanketops/git/ssh-publickey`    | Git SSH clone key (`ssh-publickey`)         |
| `/blanketops/git/known-hosts`      | Git SSH clone key (`known_hosts`)           |
| `/blanketops/registry/config`      | Registry push credential (`.dockerconfigjson`) |

These paths are platform constants, not something you name yourself. Full detail: [Environment: Secrets & SecretStore](../Api/Environments/environment.md#secrets--secretstore).

## 1. Environment

The envelope for everything that follows.

```yaml title="environment.yaml"
apiVersion: environments.blanketops.dev/v1alpha1
kind: Environment
metadata:
  name: for-kaniko-app-main
  namespace: for-kaniko-app
spec:
  contract:
    applicationName: for-kaniko-app
    branch: main
    gitOwner: blanketops01
    environmentType: development
    version: v0.1.0
    gitRepository:
      name: for-kaniko-app
    gitHubEvent:
      name: for-kaniko-app-3f2c91d
    build:
      name: build-sample-kaniko
    serviceUnits:
      - name: for-kaniko-app-api
    deployment:
      name: for-kaniko-app
    route:
      name: route-sample
    domain:
      name: for-kaniko-app-domain
    contract:
      secretStore:
        provider: aws
```

`contract.secretStore.provider` is what makes the ExternalSecrets in step 0 resolvable — set it to whichever backend you actually populated (`aws`, `vault`, `gcp`, or `azure`).

```bash
kubectl apply -f environment.yaml
```

Its `phase` stays `Pending` until every resource it references below exists and is ready.

## 2. GitRepository

Registers the source origin.

```yaml title="gitrepository.yaml"
apiVersion: sources.blanketops.dev/v1alpha1
kind: GitRepository
metadata:
  name: for-kaniko-app
  namespace: for-kaniko-app
spec:
  contract:
    provider: github
    hookUrl: https://your-webhook-endpoint.example.com/
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

## 3. GitHubEvent

In production, a real webhook delivery creates this automatically. To drive the chain manually for this walkthrough, create one directly — the same manual-dispatch path the platform itself uses for non-webhook triggers.

```yaml title="githubevent.yaml"
apiVersion: events.blanketops.dev/v1alpha1
kind: GitHubEvent
metadata:
  name: for-kaniko-app-3f2c91d
  namespace: for-kaniko-app
spec:
  contract:
    repository: blanketops01/for-kaniko-app
    eventType: push
    ref: refs/heads/main
    commitSha: 3f2c91d
```

```bash
kubectl apply -f githubevent.yaml
```

## 4. Build

Declares the deterministic transformation from source to image.

```yaml title="build.yaml"
apiVersion: environments.blanketops.dev/v1alpha1
kind: Build
metadata:
  name: build-sample-kaniko
  namespace: for-kaniko-app
spec:
  contract:
    image: docker.io/nkanyezisolutions/for-kaniko-app:main
    strategy:
      kind: ClusterBuildStrategy
      name: kaniko
    source:
      url: git@github.com:blanketops01/for-kaniko-app.git
      revision: main
      contextDir: .
      cloneSecret: git-ssh-credentials
    serviceAccount:
      name: build-bot
      secret: registry-credentials
    policy:
      triggers:
        - type: push
        - type: pull_request
```

```bash
kubectl apply -f build.yaml
```

`cloneSecret: git-ssh-credentials` and `serviceAccount.secret: registry-credentials` are names you choose — the Build controller creates an `ExternalSecret` under each name, pulling from the fixed remote keys listed in step 0. You never create these Secrets yourself.

## 5. ServiceUnit

Turns the built image into a workload contract.

```yaml title="serviceunit.yaml"
apiVersion: environments.blanketops.dev/v1alpha1
kind: ServiceUnit
metadata:
  name: for-kaniko-app-api
  namespace: for-kaniko-app
spec:
  contract:
    type: build
    buildRef:
      name: build-sample-kaniko
    containerPort: 8080
    size: 2
    appType: web
    stackType: nodejs
```

```bash
kubectl apply -f serviceunit.yaml
```

## 6. Deployment

Projects the ServiceUnit into runtime.

```yaml title="deployment.yaml"
apiVersion: environments.blanketops.dev/v1alpha1
kind: Deployment
metadata:
  name: for-kaniko-app
  namespace: for-kaniko-app
spec:
  contract:
    serviceUnits:
      - for-kaniko-app-api
    runtime: kubernetes.io/container-runtime
    strategy: Rolling
    imageAutomation: false
```

```bash
kubectl apply -f deployment.yaml
```

## 7. Route

Exposes the deployed workload.

```yaml title="route.yaml"
apiVersion: networks.blanketops.dev/v1alpha1
kind: Route
metadata:
  name: route-sample
  namespace: for-kaniko-app
spec:
  contract:
    host: api.dev.blanketops.dev
    path: /
    enabled: true
    tlsEnabled: true
    runtime: kubernetes.io/container-runtime
    serviceUnitRef:
      name: for-kaniko-app-api
```

```bash
kubectl apply -f route.yaml
```

## 8. Domain

Because `tlsEnabled: true` above, the Route needs an owned Domain to govern its certificate. Reference the Route you just created:

```yaml title="domain.yaml"
apiVersion: networks.blanketops.dev/v1alpha1
kind: Domain
metadata:
  name: for-kaniko-app-domain
  namespace: for-kaniko-app
spec:
  contract:
    host: api.dev.blanketops.dev
    routeRef:
      name: route-sample
    tlsStrategy: platform
```

```bash
kubectl apply -f domain.yaml
```

## What Just Happened

Nine resources, one Environment, one cascading delete boundary. From here:

```mathematica
Environment → GitRepository → GitHubEvent → Build → ServiceUnit → Deployment → Route → Domain
```

Each is reconciled independently, and the Environment's `status.phase` aggregates all of them into one signal.

Continue to [Verify](./verify.md) to check each stage's status.
