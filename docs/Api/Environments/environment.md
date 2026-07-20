# Environment

API Group: `environments.blanketops.dev`

Version: `v1alpha1`

Scope: `Namespaced`

---

## Description

Environment is the envelope of the delivery chain — a versioned, isolated execution context where an application runs.

It composes GitRepository, GitHubEvent, Build, Package, ServiceUnit, Deployment, Route, and Domain by reference, and owns them via `ownerReference` (cascade delete).

- Environment does not build artifacts.
- Environment does not deploy workloads.
- Environment does not route traffic.
- Environment aggregates and owns the resources that make up one application delivery.

---

### Spec

spec

---

| Field    | Type   | Required | Description             |
| -------- | ------ | -------- | -------------------------- |
| contract | object | Yes      | Environment composition contract |

---

#### spec.contract

| Field           | Type         | Required | Description                                                  |
| --------------- | ------------ | -------- | ------------------------------------------------------------ |
| applicationName | string       | Yes      | Human-readable application identifier                        |
| branch          | string       | Yes      | Git branch associated with this environment                  |
| gitOwner        | string       | Yes      | Owning Git organisation or user                               |
| environmentType | string       | Yes      | `development`, `staging`, `production`, or `testing`         |
| version         | string       | No       | Application version, semantic or otherwise                   |
| description     | string       | No       | Human-readable description                                   |
| gitRepository   | object       | No       | GitRepository composed into this environment                 |
| gitHubEvent     | object       | No       | GitHubEvent composed into this environment                    |
| build           | object       | No       | Build composed into this environment                          |
| package         | object       | No       | Package composed into this environment                       |
| serviceUnits    | []object     | No       | ServiceUnits composed into this environment                  |
| deployment      | object       | No       | Deployment composed into this environment                    |
| route           | object       | No       | Route composed into this environment                         |
| domain          | object       | No       | Domain composed into this environment                         |
| contract        | object       | No       | Platform-level bindings — see [Secrets & SecretStore](#secrets--secretstore) below |

---

#### spec.contract composed refs (gitRepository, gitHubEvent, build, package, deployment, route, domain, serviceUnits[])

Each is an object reference, resolved in the same namespace as the Environment — a composition pointer, not an embedded contract.

| Field | Type   | Required | Description                    |
| ----- | ------ | -------- | -------------------------------- |
| name  | string | Yes      | Name of the referenced CR        |

---

### Status

| Field         | Type        | Description                                                    |
| ------------- | ----------- | ---------------------------------------------------------------- |
| phase         | string      | Current aggregate lifecycle phase                                 |
| message       | string      | Human-readable status summary                                     |
| conditions    | []Condition | Per-resource readiness conditions, e.g. `BuildReady`, `DeploymentReady`, `RouteReady` |
| lastUpdatedAt | string      | Timestamp when status was last updated                            |

---

#### status.phase Values

| Value    | Meaning                                                  |
| -------- | ----------------------------------------------------------- |
| Pending  | One or more composed resources are not yet ready              |
| Ready    | All composed resources are ready                               |
| Degraded | The environment is serving but one or more resources are unhealthy |
| Failed   | One or more composed resources failed                          |

---

## Secrets & SecretStore

Every credential consumed downstream — Git SSH keys, registry push credentials, the GitHub webhook HMAC secret — is pulled from an external secrets backend via [External Secrets Operator](https://external-secrets.io/) (ESO), never created by hand and never inlined into a CR. The chain is: an environment operator's own secret manager → a `ClusterSecretStore` ESO can read → a per-resource `ExternalSecret` the platform materializes → the plain `Secret` a workload actually mounts.

`spec.contract.contract.secretStore.provider` is the one input that drives all of it. Yes, `contract` nested inside `contract` — the outer one is the Kubernetes envelope every resource uses (`spec.contract`), the inner one is `EnvironmentContract`, the Environment resource's own platform-level bindings field.

| Field                          | Type   | Required                  | Description                                            |
| ------------------------------- | ------ | -------------------------- | ---------------------------------------------------------- |
| contract.secretStore            | object | Yes, if `contract` is set  | Which external secrets backend backs this environment      |
| contract.secretStore.provider   | string | Yes                        | `aws`, `vault`, `gcp`, or `azure`                            |

`provider` resolves to a fixed `ClusterSecretStore` name — you don't choose the name yourself:

| provider | ClusterSecretStore name          |
| -------- | ------------------------------------ |
| `aws`    | `blanketops-environments-aws`        |
| `vault`  | `blanketops-environments-vault`      |
| `gcp`    | `blanketops-environments-gcp`        |
| `azure`  | `blanketops-environments-azure`      |
| _(unset/unknown)_ | falls back to a fake store — fine for a local Kind cluster, not for anything that needs real credentials |

That `ClusterSecretStore` is infrastructure you (or whoever owns the cluster) create once, pointed at your actual AWS Secrets Manager / Vault / GCP Secret Manager / Azure Key Vault instance. It is not something the Environment controller creates for you. Minimal AWS example:

```yaml
apiVersion: external-secrets.io/v1
kind: ClusterSecretStore
metadata:
  name: blanketops-environments-aws
spec:
  provider:
    aws:
      service: SecretsManager
      region: af-south-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets
            namespace: external-secrets
```

Full worked examples for AWS, Azure, and GCP ship as CRD samples in [environments-install](https://github.com/blanketops/environments-install/tree/main/config/samples).

Once that store exists, each composed CR materializes its own `ExternalSecret` against it, at a **fixed, platform-constant remote path** — these paths are not configurable per-environment, and need a value in your secret backend before the corresponding CR is applied:

| Remote key                            | Backs                                                              | Materialized Secret key(s)              | Secret type                    |
| ---------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------ | --------------------------------- |
| `/blanketops/git/ssh-privatekey`         | Build's source clone, Deployment's manifests-repo clone, Package's state-repo clone | `ssh-privatekey` (`ssh_privatekey` for Package) | `kubernetes.io/ssh-auth`          |
| `/blanketops/git/ssh-publickey`          | same three consumers                                                 | `ssh-publickey` (`ssh_publickey` for Package)   |                                    |
| `/blanketops/git/known-hosts`            | same three consumers                                                 | `known_hosts`                               |                                    |
| `/blanketops/registry/config`            | Build's registry push, Package's registry credentials                | `.dockerconfigjson` (`dockerconfigjson` for Package) | `kubernetes.io/dockerconfigjson`  |
| `/blanketops/github/webhook/secret`      | GitHubEvent's webhook signature (`spec.webhook.secretRef`)           | whatever key name `webhook.secretRef.key` declares | `Opaque`                          |
| `/blanketops/crossplane/github/token`    | Crossplane's GitHub provider (repository/webhook provisioning)       | `token`                                     | `Opaque`                          |
| `/blanketops/github/api/token`           | Listed by the install-repo secret store samples as a required path; no reconciler reads it yet | —                | —                                  |

Two secrets in this chain are **not** ESO-sourced, and need no key in your backend at all:

- **Flux's Git SSH keypair** (`<deployment-name>-flux-ssh`) — generated by the controller itself, once per Deployment, and left alone afterward.
- **The webhook hook-URL secret** (`<repository-name>-hookurl`) — copied directly from `GitRepository.spec.contract.hookUrl`, a user-declared field, not a secret-store lookup.

Populate the remote keys above before applying an Environment that composes a Build, Deployment, Package, or GitHubEvent with a webhook secret. The controller reconciles every `ExternalSecret` (and the `Secret` ESO materializes from it) automatically; there is nothing to `kubectl create secret` by hand.

---

### Example

```yaml
apiVersion: environments.blanketops.dev/v1alpha1
kind: Environment
metadata:
  name: for-kaniko-app-main
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

---

### Invariants

- `applicationName`, `branch`, and `gitOwner` together identify the environment — combinations should not collide within a namespace.
- Every resource referenced under the contract must exist in the same namespace as the Environment.
- Deleting an Environment cascades to every resource it owns via `ownerReference`.
- `phase` is derived from the aggregate readiness of composed resources — it is never set directly.
- If `contract` is set, `contract.secretStore.provider` is required.
