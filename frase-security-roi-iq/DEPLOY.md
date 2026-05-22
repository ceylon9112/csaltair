# Deployment

Pushed to **GitHub** (`ceylon9112/csaltair`) with path `frase-security-roi-iq/`.

## Azure Container Apps

Workflow: `.github/workflows/deploy-frase-roi-azure.yml`

| Resource | Default name |
|----------|----------------|
| Resource group | `frase-roi-iq-rg` |
| Container Apps environment | `frase-roi-iq-env` |
| Container App | `frase-roi-iq-web` |

Requires repository secret `AZURE_CREDENTIALS` (same as Jazz Fest / Frase Annual Review).

Optional GitHub Actions variables: `FRASE_ROI_AZURE_RESOURCE_GROUP`, `FRASE_ROI_AZURE_CONTAINER_APP_NAME`, `FRASE_ROI_AZURE_CONTAINER_ENV`.

## Local dev

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Static output in `dist/` — served by nginx in the Docker image.
