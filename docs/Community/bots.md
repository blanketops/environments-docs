---
sidebar_position: 4
title: Bots
---

# Bots

BlanketOps projects are maintained by a small set of GitHub Apps and CLI
bots that automate release workflows, pull-request hygiene, test bookkeeping,
and pull-request review. Each bot is its own Go command under
`cmd/` in the [`environments-bots`](https://github.com/blanketops/environments-bots)
repository, released on its own single-digit version scheme (`vX.Y.Z`), and
run from repository workflows through composite actions.

## Bots

| Bot | What it does | Commands |
|-----|-------------|----------|
| `releaser` | Drives every release through its Release issue: plans the next release when develop has unreleased changes, cuts the release branch and its pull request, and attaches the tag and GitHub release after a person finalizes | `plan`, `cut`, `prepare`, `verify`, `complete` |
| `developer` | PR and `develop` hygiene: syncs `develop` with `main`, opens a pull request and tracking issue on a branch's first push, closes that issue when the pull request merges, commits gofmt/go mod tidy fixes | `sync`, `open`, `resolve`, `tidy` |
| `test-helper` | Keeps one GitHub issue per test file under `tests/` and posts every test run's results to it | `sync`, `report` |
| `cleaner` | Keeps a repository's Actions footprint small: prunes old workflow runs | `runs` |
| `pr-reviewer` | Reviews pull requests against the repository's pull request template and issue templates, posts review comments and labels | `review` |

Every command takes `-dry-run` (read only) and `-repo <owner/name>`. The token
comes from `GH_TOKEN` (or `GITHUB_TOKEN`); in a workflow, mint one for the
bot's GitHub App with `actions/create-github-app-token`. Commit subjects and
other untrusted text shown in comments are written inside code spans.

## Using a bot from another repository

Every BlanketOps repository runs bots through composite actions in
`blanketops/environments-bots/.github/actions/<bot>@vX.Y.Z`. The action mints
a bot token for the calling repository, downloads the bot binary of that same
environments-bots release, verifies its Sigstore bundle against
`release.yml@refs/tags/vX.Y.Z` of this repository with cosign (a binary that
does not verify is never run), and runs one command.

### Example

```yaml
- uses: blanketops/environments-bots/.github/actions/releaser@vX.Y.Z
  with:
    command: cut               # plan | cut | prepare | verify | complete
    release: ${{ inputs.version }}   # optional for plan and cut
    app-id: ${{ secrets.RELEASER_APP_ID }}
    private-key: ${{ secrets.RELEASER_APP_PRIVATE_KEY }}
```

`ref` (default `develop`), `project` (default `blanketops/1`) and
`releaser-version` (default: the tag the action is used at) are optional.
Each repository needs the two secrets and cosign on its runners (the
zenith-runner-toolchain image has it). This repository's own workflows build
the releaser from source instead, so a change is exercised before it is
released.

## Releases

Each tag `vX.Y.Z` publishes `<tool>-linux-amd64` and
`<tool>-linux-arm64` for every tool (`test-helper`, `releaser`,
`developer`), a `SHA256SUMS` file, and a Sigstore bundle per file. Verify a
download:

```bash
cosign verify-blob --bundle test-helper-linux-amd64.sigstore.json \
  --certificate-identity https://github.com/blanketops/environments-bots/.github/workflows/release.yml@refs/tags/vX.Y.Z \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  test-helper-linux-amd64
gh attestation verify test-helper-linux-amd64 --repo blanketops/environments-bots
```

## Contributing

See [CONTRIBUTING.md](https://github.com/blanketops/environments-bots/blob/main/CONTRIBUTING.md).
Work branches merge into `develop`; `main` receives releases. Commits follow
Conventional Commits and are signed off (`git commit -s`) and signed.