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
bops-env version
```

Run it with no arguments and `bops-env` prints its banner, the cluster context it's connected to, and a full command reference.

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

This applies the CRDs, RBAC, and controller-manager `Deployment` published by [environments-install](https://github.com/blanketops/environments-install) — every resource in the chain:

| Group                    | Resources                                                                                                                                                                                                                        |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `environments.blanketops.dev` | [Environment](../Api/Environments/environment.md), [Build](../Api/Environments/build.md), [Package](../Api/Environments/package.md), [ServiceUnit](../Api/Environments/serviceunit.md), [Deployment](../Api/Environments/deployment.md) |
| `sources.blanketops.dev`      | [GitRepository](../Api/Sources/gitrepository.md)                                                                                                                                                                                    |
| `events.blanketops.dev`       | [GitHubEvent](../Api/Events/githubevent.md)                                                                                                                                                                                        |
| `networks.blanketops.dev`     | [Route](../Api/Networks/route.md), [Domain](../Api/Networks/domain.md)                                                                                                                                                            |

## 4. Install the Platform Stack

The operator reconciles BlanketOps CRDs into workloads on a supporting stack: `carvel`, `argoevents`, `tekton-pipelines`, `tekton-dashboard`, `shipwright`, `crossplane`, `externalsecrets`, `buildstrategies`, `flux`, `knative`, and `kourier`. Install the whole stack in one shot:

```bash
bops-env dependencies install
```

This can take several minutes on a fresh cluster — it's pulling and starting every component in the stack.

Each dependency is also individually addressable, useful when you only need to reinstall one piece:

```bash
bops-env dependencies list              # every dependency name above
bops-env dependencies status            # install status for all of them
bops-env dependencies status knative    # status for just one
bops-env dependencies install knative   # (re)install just one
bops-env dependencies uninstall knative # remove just one
```

## 5. Confirm It's Running

```bash
bops-env dependencies status
```

Or check pods directly:

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
