# Runbooks

Step-by-step operational recipes: how to configure, enable, or recover things in this project. Unlike [`../docs/`](../docs/README.md) (design docs explaining _why_), runbooks describe _how_ — concrete steps an operator follows.

## How to add a runbook

1. Create `runbook/<slug>.md` with a short intro (what it enables, which env/services are involved) and numbered steps. Include a Troubleshooting section when failures are non-obvious.
2. Add a row to the index below.

## Index

| Runbook                           | What it covers                                                              |
| --------------------------------- | --------------------------------------------------------------------------- |
| [Admin access](./admin-access.md) | GitHub OAuth App setup, required env vars, local dev login, troubleshooting |
