# BlanketOps Environments Docs

Documentation site for [BlanketOps Environments](https://github.com/blanketops/environments), a deterministic software delivery platform for Kubernetes. Built with [Docusaurus](https://docusaurus.io/), deployed to Netlify at [blanketops-environments.netlify.app](https://blanketops-environments.netlify.app).

Covers Getting Started, the API reference, Concepts, and the delivery model — see `docs/`.

## Development

```bash
npm ci
npm start
```

Starts a local dev server at `localhost:3000` with live reload.

## Build

```bash
npm run build
```

Generates static content into `build/`. `onBrokenLinks: 'throw'` in `docusaurus.config.ts` fails this on any broken internal link or anchor.

## Typecheck

```bash
npm run typecheck
```

## Server

`cmd/server` is a small Go static-file server that ships the built site via `ko` — see `.ko.yaml` and `.github/workflows/ko.yml`.

## Deployment

Netlify builds and deploys automatically on push to `main` — see `netlify.toml`.
