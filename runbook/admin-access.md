# Enabling admin access

Admin login rides on a GitHub **OAuth App** (the same mechanism the reading-list flow uses) plus three env vars. The flow: `/admin` → `/admin/login` → GitHub authorize → `/api/v1/oauth` verifies the login equals `GH_AUTHOR_LOGIN` → signed `admin_session` cookie (7 days).

Design background: [docs/0001 — Runtime Postgres-backed content model](../docs/0001-content-runtime-postgres.md).

## 1. `GH_AUTHOR_LOGIN`

Your GitHub username. The OAuth callback grants a session **only** to exactly this login — any other GitHub account gets a 401.

## 2. `GITHUB_CLIENT_ID` and `GITHUB_SECRET` (OAuth App credentials)

1. Go to <https://github.com/settings/developers> (GitHub → Settings → Developer settings → **OAuth Apps**).
2. Open the existing app, or click **New OAuth App** with:
   - **Homepage URL:** `https://website-url`
   - **Authorization callback URL:** `https://website-url/api/v1/oauth` — must match exactly; an OAuth App supports a single callback URL.
3. The app page shows the **Client ID** → `GITHUB_CLIENT_ID`.
4. Click **Generate a new client secret** → `GITHUB_SECRET`. It is shown once — copy it immediately.

## 3. Set the env and log in

1. Set `GH_AUTHOR_LOGIN`, `GITHUB_CLIENT_ID`, `GITHUB_SECRET` on the production container (locally: `.env`).
2. Restart the app, open `/admin`, authorize on GitHub, land on the dashboard.

## Local development

GitHub validates the callback URL against the registered one, so the production app won't accept a `localhost` redirect. Create a **second** OAuth App with callback `http://localhost:5173/api/v1/oauth` and put its client id/secret in `.env`.

## Troubleshooting

- **401 "Not authorized"** — you authorized with a GitHub account whose login ≠ `GH_AUTHOR_LOGIN`, or the env var is misspelled. The server log prints expected vs received usernames.
- **GitHub error "redirect_uri is not associated with this application"** — the origin you are browsing from doesn't match the OAuth App's registered callback URL.
- **Instantly redirected back to `/admin/login`** — the session cookie wasn't accepted: check the browser kept `admin_session` (it is `Secure` in production, so plain-HTTP origins drop it).
