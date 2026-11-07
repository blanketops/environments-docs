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

```environments-contract ─┐
                       ├─→ environments ─→ environments-controller
   environments-api ──────┘```
```

A change that crosses repositories lands in that order, and each step is a tagged release that the next one picks up through `go.mod`. Dependabot opens the bump pull requests here for environments-api and environments-contract.

Pinned versions are in [go.mod](../go.mod). Check them before assuming a contract field or a CRD Kind is available.

## Local Testing

The `environments-bots` repository holds the GitHub Apps and CLI bots that automate the BlanketOps family's repositories: release workflows, PR hygiene, test bookkeeping, and PR review. Each bot is its own Go command under `cmd/`, released on its own single-digit version scheme (`vX.Y.Z`), and run from repository workflows through composite actions.

| Bot | What it does | Commands |
|-----|-------------|----------|
| `releaser` | Drives every release through its Release issue: plans the next release when develop has unreleased changes, cuts the release branch and its pull request, and attaches the tag and GitHub release after a person finalizes | `plan`, `cut`, `prepare`, `verify`, `complete` |
| `developer` | PR and `develop` hygiene: syncs `develop` with `main`, opens a pull request and tracking issue on a branch's first push, closes that issue when the pull request merges, commits gofmt/go mod tidy fixes | `sync`, `open`, `resolve`, `tidy` |
| `test-helper` | Keeps one GitHub issue per test file under `tests/` and posts every test run's results to it | `sync`, `report` |
| `cleaner` | Keeps a repository's Actions footprint small: prunes old workflow runs | `runs` |
| `pr-reviewer` | Reviews pull requests against the repository's pull request template and issue templates, posts review comments and labels | `review` |

Every command takes `-dry-run` (read only) and `-repo <owner/name>`. The token comes from `GH_TOKEN` (or `GITHUB_TOKEN`); in a workflow, mint one for the bot's GitHub App with `actions/create-github-app-token`. Commit subjects and other untrusted text shown in comments are written inside code spans.

### Using a bot from another repository

## Provenance and Verification

Every release is signed and attested to ensure artifact integrity from build to deployment:

## Patterns

**Contract first.** Field names, enums and semantics come from the contract. Import its types from `github.com/blanketops/environments-contract/blanketops/...`. Do not redeclare a contract enum locally.

**Resolution decodes and nothing else.** A `Resolve<Kind>` function takes the CR, rejects a nil object or an empty `Spec.Contract`, decodes the raw JSON, validates required fields and returns a typed struct or an error. The same spec always yields the same struct. No client calls, no clock, no randomness.

**Three packages per Kind in `resolution/`.** `resolve`, `adapter` and `contract` change for different reasons and are kept apart.

**One cohesive `domain` package.** Model, phases, result and errors refer to each other and stay in one package.

**Service, Mapper, StatusWriter.** The service is constructed with its collaborators and exposes `Reconcile`. The Mapper converts resolved to domain types. The StatusWriter is the only thing that writes status.

# Verify the attestation via GitHub CLI
gh attest verify bops-env-static --owner blanketops
