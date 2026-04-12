# Deploy Frase Annual Review (GitHub + Azure, SaltAIR-aligned)

This app is a **static Vite SPA** and lives in the **SaltAIR monorepo** at **`frase-protection-annual-review/`** (same Git history as `main` — no unrelated root). SaltAIR’s typical pattern is **Azure Static Web Apps** + **GitHub Actions** (see `SaltAIr-Platform/docs/DEPLOYMENT_HANDOFF.md` for full-stack context).

**Canonical GitHub repo:** `ceylon9112/csaltair`. Work from this folder is committed and pushed on **`main`** like the rest of the repo. The Frase workflow (`.github/workflows/frase-azure-static-web-apps.yml` at repo root) also runs on **`frase-annual-review`** if you use that branch. `package.json` → `saltair.pushRemoteBranch` defaults to **`main`**.

## Workflow fix (important)

CI builds with `npm run build`, then deploys the **`dist`** folder. With `skip_app_build: true`, Azure expects:

- **`app_location: dist`** — folder to upload  
- **`output_location: ''`** — empty (see Microsoft Learn: *Build configuration for Azure Static Web Apps*)

`staticwebapp.config.json` lives in **`public/`** so Vite copies it into **`dist/`** for Azure routing.

## 1. Push to GitHub

### Option A — One command (creates repo + pushes)

Requires a [Personal Access Token](https://github.com/settings/tokens) with **`repo`** scope (classic) or fine-grained **Contents: Read and write** on the target repo.

```powershell
cd "path/to/frase-protection-annual-review"
$env:GITHUB_TOKEN = "ghp_xxxxxxxx"   # your PAT
npm run github:auto
```

This creates **`frase-protection-annual-review`** under your GitHub user (private), then pushes **`main`**. Override the name: `$env:GITHUB_REPO_NAME = "other-name"` or set **`"repoName"`** in `deploy.local.json`.

**Token without env vars:** copy `deploy.local.example.json` → **`deploy.local.json`** (gitignored) and set **`"githubToken"`** to your PAT. The script reads `GITHUB_TOKEN` / `GH_TOKEN` first, then `deploy.local.json`.

**Push branch:** Default is **`main`**. To push a local branch to a different remote name (e.g. **`frase-annual-review`** only), set **`"pushRemoteBranch"`** in `deploy.local.json` or **`package.json` → `saltair.pushRemoteBranch`**.

### Option B — Existing empty repo URL

1. Create an **empty** repository on GitHub, or use an existing repo’s HTTPS URL.

2. Copy `deploy.local.example.json` → `deploy.local.json` and set `"remoteUrl"`, **or**:

   ```powershell
   $env:GITHUB_REMOTE_URL = "https://github.com/ORG/REPO.git"
   npm run github:push
   ```

### Option C — manual

```bash
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

If push fails with **repository not found**, the repo doesn’t exist yet or the URL is wrong. If **auth** fails, use a PAT or Git Credential Manager.

## 2. Azure Static Web App

1. **Azure Portal** → **Create** → **Static Web App** (link **Deployment** to `https://github.com/ceylon9112/csaltair` when possible so CI can auto-resolve the app).
2. If the portal generated its **own** workflow, either delete the duplicate job or align secrets so only **this** repo’s workflow deploys.

## 3. GitHub — where “Secrets and variables” actually is

<a id="github-actions-secrets"></a>

**It is not under your GitHub account / profile.**  
If you open **github.com → your profile picture → Settings**, you will **not** see “Secrets and variables”. That page is **account** settings (password, email, billing).

**Actions secrets live on each repository:**

1. Open the **repository** in the browser, e.g. [github.com/ceylon9112/csaltair](https://github.com/ceylon9112/csaltair).
2. In the **top bar of the repo** (same row as **Code**, **Issues**, **Pull requests**), click **Settings** — **not** the global profile menu.
3. In the **left sidebar** of **repository** Settings, open **Secrets and variables** → **Actions**.

**Direct links (this repo):**

- **Actions secrets:** [github.com/ceylon9112/csaltair/settings/secrets/actions](https://github.com/ceylon9112/csaltair/settings/secrets/actions)  
- **Actions variables:** [github.com/ceylon9112/csaltair/settings/variables/actions](https://github.com/ceylon9112/csaltair/settings/variables/actions)

**If you do not see a “Settings” tab** on the repository: your GitHub user is not an **administrator** of that repo (e.g. read-only or write collaborator). Only owners/admins can add Actions secrets. Ask the repo owner to add the secret, or transfer the repo to an account you control.

**If “Settings” exists but there is no “Secrets and variables”:** ensure **GitHub Actions** is enabled: **Settings → Actions → General** → allow Actions to run.

**Without using the website:** install [GitHub CLI](https://cli.github.com/), run `gh auth login`, then you can create secrets from the terminal (no UI):

```bash
# Service principal JSON file (recommended)
gh secret set AZURE_CREDENTIALS --repo ceylon9112/csaltair < path/to/sp.json

# Or deployment token only (paste when prompted)
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo ceylon9112/csaltair
```

From this project folder you can also run **`npm run github:open-secrets`** — it prints these URLs and tries to open the Actions secrets page in your browser.

**Repository secrets vs environment secrets (same page):** On the Actions secrets screen you may see **Environment secrets** (empty, or “This environment has no secrets”) *and* **Repository secrets**. This workflow only reads **repository** secrets — **`AZURE_CREDENTIALS`** listed under **Repository secrets** is the right place. You do **not** need to create a GitHub Environment or copy the secret there unless you change the workflow to use `environment:`. Empty environment secrets are normal.

---

### Recommended: secret `AZURE_CREDENTIALS`

1. Create a **service principal** with access to the subscription or resource group that contains your Static Web App ([az ad sp create-for-rbac --sdk-auth](https://learn.microsoft.com/cli/azure/ad/sp#az-ad-sp-create-for-rbac)).
2. Add the full JSON as a repository secret named **`AZURE_CREDENTIALS`** (UI links above, or `gh secret set` above).
3. Grant the principal at least **Contributor** on the resource group that holds the Static Web App.

On each push, the workflow **logs into Azure in CI**, resolves your Static Web App (repo URL match or **Variables** below), fetches the deployment token, and uploads **`dist/`**.

**Optional repository Variables** (if auto-discovery can’t find a unique app):

| Name | Example |
|------|---------|
| `AZURE_STATIC_WEB_APP_NAME` | Your SWA resource name |
| `AZURE_RESOURCE_GROUP` | Resource group name |

### Fallback: secret `AZURE_STATIC_WEB_APPS_API_TOKEN` only

If you cannot use a service principal, add the Static Web App **deployment token** as **`AZURE_STATIC_WEB_APPS_API_TOKEN`** (Azure Portal → Static Web App → **Manage deployment token**). Set it via the [secrets URL](https://github.com/ceylon9112/csaltair/settings/secrets/actions) or `gh secret set`.

### Azure Portal (optional)

When you **create** a Static Web App in Azure and choose **GitHub** as the source, the wizard can **authorize** GitHub and sometimes **create** workflow secrets for you. If you used that flow, check the repo for an existing secret (names may include a suffix); align our workflow to use **`AZURE_CREDENTIALS`** or **`AZURE_STATIC_WEB_APPS_API_TOKEN`** as documented.

## 4. SaltAIR

Register repo URL, resource group, and SWA name in your SaltAIR/client deployment registry per internal process (`SaltAIr-Platform/docs/DEPLOYMENT_HANDOFF.md`).

## Troubleshooting: “nothing reaches Azure”

1. **No `origin` remote** — Git has nowhere to push until `origin` exists (see [§1](#1-push-to-github)).

2. **Build passes but Azure doesn’t update** — Confirm **`AZURE_CREDENTIALS`** (or **`AZURE_STATIC_WEB_APPS_API_TOKEN`**) exists on the repo and the service principal can read the Static Web App. Check the Actions log for the “Fetch deployment token” step.

3. **Wrong branch** — Workflow runs on **`main`** and **`frase-annual-review`**.

4. **Email: “No jobs were run”** — Usually a **workflow YAML validation** issue (fixed in the repo: deploy uses a `deploy_gate` step so `if:` never reads outputs from skipped steps). If it happens again, open the failed run → **Workflow file** tab for the exact parse error.

## Handoff (what’s done in-repo)

| Piece | Location |
|--------|----------|
| Build + deploy workflow | `.github/workflows/azure-static-web-apps.yml` — `npm ci` / `npm run build`, then upload `dist/` when secrets allow |
| SPA routing on Azure | `public/staticwebapp.config.json` → copied to `dist/` by Vite |
| Git / branch defaults | `package.json` → `repository`, `saltair.pushRemoteBranch` |
| Optional local tools | `npm run deploy:check` (needs `gh`), `npm run azure:github-secret` (legacy token upload) |

**You only configure GitHub once:** add **`AZURE_CREDENTIALS`** (recommended) or **`AZURE_STATIC_WEB_APPS_API_TOKEN`**, then push **`main`** (or **`frase-annual-review`** if you use that branch).

## Notes

- **HTTPS** is default on Static Web Apps.
- Data stays in **browser localStorage** unless you add a backend.
