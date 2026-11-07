# Developing BlanketOps Environments

How the code is organised, how the repositories fit together, and how to make the common kinds of change. For process — issues, branches, commit format, sign-off, review — see [CONTRIBUTING.md](../CONTRIBUTING.md).

## How the repositories relate

A resource such as a Build or a ServiceUnit is defined once, as a versioned protobuf contract. Kubernetes stores it inside an opaque envelope. This module turns that envelope into typed intent and supplies the logic to act on it. The controller runs that logic.

| Repository | Owns | Relation to this module |
|---|---|---|
| [environments-contract](https://github.com/blanketops/environments-contract) | Protobuf schemas under `blanketops/<group>/<version>/*.proto` and their generated Go | Imported here. The meaning of every field comes from it. |
| [environments-api](https://github.com/blanketops/environments-api) | CRD Go types and generated CRD manifests | Imported here. Every Kind is an envelope: `Spec.Contract runtime.RawExtension` plus `Status.Conditions`. |
| environments | Resolution, per-Kind domain logic, providers, the `core/` engine framework, the cache | This module. A library: no `cmd/`, no manager. |
| [environments-controller](https://github.com/blanketops/environments-controller) | The running manager: reconcilers, `core/domain.Domain` implementations, mediators | Imports this module and calls into it. |
| [environments-install](https://github.com/blanketops/environments-install) | Installable manifests: CRDs, RBAC, samples | Carries copies of the CRDs generated in environments-api. Not a Go dependency. |
| [environments-cli](https://github.com/blanketops/environments-cli) | The `bops` command-line client | Not a Go dependency. Shipped alongside in releases. |
| [environments-tests](https://github.com/blanketops/environments-tests) | Conformance test suite for the API surface | Not a Go dependency. |
| [environments-docs](https://github.com/blanketops/environments-docs) | The documentation website | Describes the Kinds and their state transitions. |
| [environments-bots](https://github.com/blanketops/environments-bots) | GitHub Apps and CLI bots: releaser, developer, test-helper, cleaner, pr-reviewer | Runs the project's automation: release workflows, PR hygiene, test bookkeeping, PR review. Imports this module for Go types; ships its own binaries. |

Go dependencies point one way:

```environments-contract ─┐
                       ├─→ environments ─→ environments-controller
environments-api ──────┘
```

## Build & Install

```bash
# Standard binary
mage build

# Fully static (Gokrazy-compatible)
mage static

# Install to local bin
mage install   # → $HOME/.local/bin or $HOME/bin
```

## Local Testing

```bash
# Create a test cluster
kind create cluster

# Install the operator
bops-env install

# Install platform stack dependencies
bops-env dependencies install

# Verify components
kubectl get pods -A
```

## Provenance and Verification

Every release is signed and attested to ensure artifact integrity from build to deployment:

- **Signed**: Binaries are signed using `cosign` (keyless mode)
- **Attested**: Every build generates a formal SLSA-compliant provenance attestation

Verification after download:

```bash
# Verify the signature
curl -LO https://github.com/blanketops/environments-cli/releases/latest/download/bops-env-static.sig
cosign verify-blob --certificate-identity-regexp ".*" --signature bops-env-static.sig bops-env-static

# Verify the attestation via GitHub CLI
gh attest verify bops-env-static --owner blanketops
