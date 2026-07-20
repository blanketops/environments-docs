---
sidebar_position: 2
---

# Installation

## 1. Install the `bops-env` CLI

Download a signed prebuilt binary:

```bash
# Linux amd64
curl -LO https://github.com/blanketops/environments-cli/releases/latest/download/bops-env-static
chmod +x bops-env-static
sudo mv bops-env-static /usr/local/bin/bops-env

# Linux arm64
curl -LO https://github.com/blanketops/environments-cli/releases/latest/download/bops-env-static-arm64
chmod +x bops-env-static-arm64
sudo mv bops-env-static-arm64 /usr/local/bin/bops-env
```

Or build it locally from source:

```bash
git clone https://github.com/blanketops/environments-cli.git
cd environments-cli
mage install   # builds and installs to ~/.local/bin (falls back to ~/bin)
```

Confirm it's on your `PATH`:

```bash
bops-env
```

With no arguments, `bops-env` prints its banner, the cluster context it's connected to, and a full command reference.

## 2. Point at a Cluster

If you already have a Kubernetes cluster and a working `kubectl` context, skip to step 3.

Otherwise, spin up a local [Kind](https://kind.sigs.k8s.io/) cluster:

```bash
bops-env cluster up dev
```

Useful companions:

```bash
bops-env cluster status dev   # is it up?
bops-env cluster down dev     # tear it down
```

## 3. Install the Operator

```bash
bops-env install
```

This applies the CRDs, RBAC, and controller-manager `Deployment` published by [environments-install](https://github.com/blanketops/environments-install) — [Environment](../Api/Environments/environment.md), [GitRepository](../Api/Sources/gitrepository.md), [GitHubEvent](../Api/Events/githubevent.md), [Build](../Api/Environments/build.md), [Package](../Api/Environments/package.md), [ServiceUnit](../Api/Environments/serviceunit.md), [Deployment](../Api/Environments/deployment.md), [Route](../Api/Networks/route.md), and [Domain](../Api/Networks/domain.md).

## 4. Install the Platform Stack

The operator reconciles BlanketOps CRDs into workloads on a supporting stack — Tekton, Shipwright, Knative Serving, Kourier, Crossplane, External Secrets Operator, and Argo Events. Install it in one shot:

```bash
bops-env dependencies install
```

This can take several minutes on a fresh cluster — it's pulling and starting every component in the stack.

## 5. Confirm It's Running

```bash
kubectl get pods -A
```

Look for `Running` pods across the `blanketops-environments`, `tekton-pipelines`, `shipwright-build`, `knative-serving`, `kourier-system`, `crossplane-system`, `external-secrets`, and `argo-events` namespaces before moving on.

## Uninstalling

In reverse order:

```bash
bops-env dependencies uninstall
bops-env uninstall
bops-env cluster down dev   # only if you created a Kind cluster in step 2
```

Continue to [Quickstart](./quickstart.md).
