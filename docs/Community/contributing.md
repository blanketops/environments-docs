---
sidebar_position: 2
title: Contributing
---

# Contributing

The full guide is [`CONTRIBUTING.md`](https://github.com/blanketops/environments/blob/main/CONTRIBUTING.md). In short:

- **Bugs and features** — open an issue with the **Bug**, **Feature** or
  **Question** template, in the repository whose code is affected. Not sure
  which? Open it in [`environments`](https://github.com/blanketops/environments/issues).
- **Larger changes** — to a public API, a contract or the delivery model:
  open an issue to discuss the approach before writing code.
- **Pull requests** — branch from `develop`, add tests, run
  `go build ./... && go vet ./...`, `gofmt -l .`, `golangci-lint run`
  and `go test ./...`, then open the pull request against `develop`.
- **Commits** — use [Conventional Commits](https://www.conventionalcommits.org/)
  and sign off each commit (`git commit -s`) under the
  [Developer Certificate of Origin](https://developercertificate.org/).
- **Security issues** — never in a public issue; see [Security](./security.md).

Contributions are licensed under the Apache License 2.0.
