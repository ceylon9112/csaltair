# Deploy Jazz Fest 2026 (SaltAIr-style: GitHub + Azure)

This repo follows the same pattern as other Salt Air projects: **GitHub** hosts source; **GitHub Actions** builds a **Docker** image and deploys to **Azure Container Apps** (nginx serving the **patron-web** Vite build).

## 1. Push to GitHub

Prerequisites: [Git](https://git-scm.com/) installed; a GitHub account.

1. Create an empty repository on GitHub (no README/license), e.g. `your-org/jazz-fest-2026`.
2. From this folder:

```powershell
cd "c:\Users\ceylo\salt air\jazz-fest-2026"
git remote add origin https://github.com/YOUR_ORG/jazz-fest-2026.git
git push -u origin main
```

Optional: install [GitHub CLI](https://cli.github.com/) (`gh`), run `gh auth login`, then:

```powershell
gh repo create your-org/jazz-fest-2026 --private --source . --remote origin --push
```

## 2. Azure credentials for GitHub Actions

1. [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli): `az login` and select the subscription that should host the app (Salt Air builds often use the **`SaltAir_Builds`** subscription when that applies).

2. Create a service principal and JSON for `AZURE_CREDENTIALS` (subscription scope is typical for Container Apps):

```powershell
az ad sp create-for-rbac --name "jazz-fest-2026-github-deploy" --role contributor --scopes /subscriptions/YOUR_SUBSCRIPTION_ID --sdk-auth
```

Copy the **entire JSON** output.

3. In the GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**

   - Name: `AZURE_CREDENTIALS`  
   - Value: paste the JSON.

4. Optional **Variables** (same page → **Variables** tab) — defaults match the workflow if unset:

   | Name | Example |
   |------|---------|
   | `AZURE_RESOURCE_GROUP` | `jazz-fest-2026-rg` |
   | `AZURE_CONTAINER_APP_NAME` | `jazz-fest-2026-web` |
   | `AZURE_CONTAINER_ENV` | `jazz-fest-2026-env` |

## 3. Deploy to Azure

- **Automatic:** push to **`main`** (or open **Actions → Deploy to Azure → Run workflow**).

The workflow creates the resource group and Container Apps environment if missing, builds the **Dockerfile** in ACR, and deploys the container (**port 80**, nginx static SPA).

- **URL:** check the job log **Deployment URL**, or:

```powershell
az containerapp show --name jazz-fest-2026-web --resource-group jazz-fest-2026-rg --query "properties.configuration.ingress.fqdn" -o tsv
```

## 4. What gets deployed

- **Dockerfile:** multi-stage build — `npm ci` at repo root + `patron-web`, `npm run build:web:vite`, then **nginx** serves `patron-web/dist` with SPA fallback.
- The **Expo native** app is **not** in this image; use **EAS Build** locally for iOS/Android (see `README.md`).
