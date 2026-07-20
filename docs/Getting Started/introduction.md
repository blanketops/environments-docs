---
sidebar_position: 1
---

# Introduction

BlanketOps Environments is a Kubernetes-native delivery platform.

It models software delivery — from a Git push to a running, routed, TLS-terminated workload — as a chain of reconciled Custom Resources, not a pipeline script.

See [`Delivery as Deterministic State`](../Model/state-machine.md) and [`Entropy in Software Delivery`](../Model/entropy.md) for why that distinction matters.

## What You're Installing

A single CLI, `bops-env`, bootstraps the whole stack directly against the Kubernetes API — no Helm charts to hand-tune, no cluster-specific YAML to assemble:

- The **BlanketOps Environments operator** — the CRDs, RBAC, and controller-manager that reconcile [`Environment`](../Api/Environments/environment.md), [`GitRepository`](../Api/Sources/gitrepository.md), [`GitHubEvent`](../Api/Events/githubevent.md), [`Build`](../Api/Environments/build.md), [`Package`](../Api/Environments/package.md), [`ServiceUnit`](../Api/Environments/serviceunit.md), [`Deployment`](../Api/Environments/deployment.md), [`Route`](../Api/Networks/route.md), and [`Domain`](../Api/Networks/domain.md).
- The **platform stack** these resources build on: Tekton, Shipwright, Knative Serving, Kourier, Crossplane, Argo Events, and External Secrets Operator.

## What You'll Do in This Guide

1. [`Installation`](./installation.md) — get `bops-env` on your machine and the platform running on a cluster.
2. [`Quickstart`](./quickstart.md) — the fastest path to a reconciled resource, to confirm the install worked.
3. [`First Delivery`](./first-delivery.md) — a full walkthrough: source → build → deploy → route → TLS, using one real example application.
4. [`Verify`](./verify.md) — the `kubectl get` commands to inspect every stage of that delivery.
5. [`Next Steps`](./next-steps.md) — where to go once the example is running.

## Before You Start

You'll need:

- A terminal with `kubectl` on your `PATH`.
- [`kind`](https://kind.sigs.k8s.io/) if you don't already have a cluster to point at — the CLI's `cluster` commands are Kind-only for local development.
- Cluster-admin access to whichever cluster you install into — the operator installs CRDs and cluster-scoped RBAC.

Nothing else. The CLI embeds every manifest it applies.
