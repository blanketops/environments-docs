
## What

<!-- One or two sentences. What pages/sections does this change? -->

## Why

<!-- The intent. Link the issue if one exists: Closes #123 -->

## Section

<!-- Mark all that apply -->

* [ ] `Getting Started`
* [ ] `Concepts`
* [ ] `Api`
* [ ] `Model`
* [ ] `Why`
* [ ] Site structure / navigation (sidebars.ts, docusaurus.config.ts)
* [ ] CI / release tooling

## Accuracy

<!-- Anything describing resource behavior (fields, required/optional, enum values, apiVersion, status phases) should trace to a real source, not the previous doc text. -->

* [ ] Field names, types, and required/optional markers checked against `environments-contract` and/or `environments`'s resolution layer (`resolution/<resource>/resolve/resolve.go` is more authoritative than the `.proto` when they disagree)
* [ ] `apiVersion` matches what's actually `served: true` in the installed CRD (`environments-install/config/crd`), not just what a `.proto` file happens to define
* [ ] CR examples use `namespace: dev` and contain no real personal data, tokens, or org-specific hosts (`example`/`example-org`/`*.example.com` placeholders instead)

## Checklist

* [ ] `npm run build` passes locally (`onBrokenLinks: 'throw'` catches broken internal links/anchors — this has caught real issues before)
* [ ] `npm run typecheck` passes
* [ ] New/changed CR examples are valid YAML (correct indentation — this has broken before)
* [ ] Cross-links between a Concepts page and its Api reference page (and vice versa) are present where relevant

## Notes for reviewer

<!-- Anything non-obvious: design trade-offs, deferred follow-ups, areas needing close attention -->
