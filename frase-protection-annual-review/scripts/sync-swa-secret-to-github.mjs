/**
 * Optional / legacy: push deployment token to GitHub as AZURE_STATIC_WEB_APPS_API_TOKEN.
 * Preferred setup: add AZURE_CREDENTIALS to GitHub only — CI fetches the token (see DEPLOY.md).
 *
 * Prereqs: Azure CLI (az login), GitHub CLI (gh auth login).
 *
 * Static Web App resolution (first match wins):
 *   1. Env: AZURE_STATIC_WEB_APP_NAME + AZURE_RESOURCE_GROUP
 *   2. package.json → saltair.azureStaticWebAppName + saltair.azureResourceGroup
 *   3. Auto: az staticwebapp list → site whose properties.repositoryUrl contains this repo (package.json repository.url)
 *
 * Usage: npm run azure:github-secret
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathsFromScriptDir } from './repo-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { appRoot: root } = pathsFromScriptDir(__dirname)

function readPackageJson() {
  const p = path.join(root, 'package.json')
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function githubSlugFromUrl(url) {
  if (!url || typeof url !== 'string') return null
  const m = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/i)
  if (!m) return null
  return { owner: m[1], repo: m[2].replace(/\.git$/i, ''), full: `${m[1]}/${m[2].replace(/\.git$/i, '')}` }
}

function run(cmd, args, { allowFailure = false } = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' })
  if (r.error) {
    if (allowFailure) return { ok: false, out: '', err: String(r.error), status: 1 }
    console.error(r.error)
    process.exit(1)
  }
  if (r.status !== 0 && !allowFailure) {
    console.error(r.stderr || r.stdout || `exit ${r.status}`)
    process.exit(r.status ?? 1)
  }
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim(), status: r.status ?? 0 }
}

function requireAzGh() {
  const az = spawnSync('az', ['--version'], { encoding: 'utf8' })
  if (az.status !== 0) {
    console.error('Install Azure CLI and run: az login\nhttps://learn.microsoft.com/cli/azure/install-azure-cli')
    process.exit(1)
  }
}

function listStaticWebApps() {
  const r = run('az', ['staticwebapp', 'list', '-o', 'json'])
  try {
    const arr = JSON.parse(r.out || '[]')
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function resourceGroupFromArm(item) {
  if (item.resourceGroup) return item.resourceGroup
  const id = item.id || ''
  const m = id.match(/\/resourceGroups\/([^/]+)\//i)
  return m ? m[1] : ''
}

function repositoryUrlProp(item) {
  return item.properties?.repositoryUrl || ''
}

function findSwaForRepo(sites, slug) {
  if (!slug) return { site: null, ambiguous: false }
  const needle = `${slug.owner}/${slug.repo}`
  const matches = []
  for (const s of sites) {
    const url = String(repositoryUrlProp(s))
    if (!url) continue
    if (url.includes(needle)) {
      matches.push({
        name: s.name,
        resourceGroup: resourceGroupFromArm(s),
        repositoryUrl: url,
      })
    }
  }
  if (matches.length === 0) return { site: null, ambiguous: false }
  if (matches.length > 1) {
    return { site: null, ambiguous: true, needle, matches }
  }
  return { site: matches[0], ambiguous: false }
}

function resolveGhRepoSlug(pkg) {
  const fromPkg = githubSlugFromUrl(pkg.repository?.url || '')
  if (fromPkg) return `${fromPkg.owner}/${fromPkg.repo}`
  const r = run('git', ['remote', 'get-url', 'origin'], { allowFailure: true })
  if (r.ok && r.out) {
    const fromGit = githubSlugFromUrl(r.out)
    if (fromGit) return `${fromGit.owner}/${fromGit.repo}`
  }
  return ''
}

async function main() {
  requireAzGh()

  const pkg = readPackageJson()
  const slug = githubSlugFromUrl(pkg.repository?.url || '')

  let name =
    process.env.AZURE_STATIC_WEB_APP_NAME?.trim() ||
    (typeof pkg.saltair?.azureStaticWebAppName === 'string' ? pkg.saltair.azureStaticWebAppName.trim() : '') ||
    ''
  let rg =
    process.env.AZURE_RESOURCE_GROUP?.trim() ||
    (typeof pkg.saltair?.azureResourceGroup === 'string' ? pkg.saltair.azureResourceGroup.trim() : '') ||
    ''

  if (!name || !rg) {
    const sites = listStaticWebApps()
    const { site, ambiguous, needle, matches } = findSwaForRepo(sites, slug)
    if (ambiguous) {
      console.error(`Multiple Static Web Apps reference ${needle}:`)
      for (const m of matches) {
        console.error(`  - ${m.name} (rg: ${m.resourceGroup})`)
      }
      console.error(
        'Set saltair.azureStaticWebAppName and saltair.azureResourceGroup in package.json, or AZURE_STATIC_WEB_APP_NAME and AZURE_RESOURCE_GROUP.',
      )
      process.exit(1)
    }
    if (site) {
      name = name || site.name
      rg = rg || site.resourceGroup
      console.log(`Using Static Web App linked to GitHub: ${site.name} (resource group: ${site.resourceGroup})`)
    }
  }

  if (!name || !rg) {
    const hintRepo = slug ? `https://github.com/${slug.full}` : 'your GitHub repository'
    console.error(`
Could not resolve Static Web App name and resource group.

Option A — In Azure Portal, link a Static Web App to ${hintRepo}, then run again (this script matches az staticwebapp list to your package.json repository URL).

Option B — Set in package.json:
  "saltair": { "azureStaticWebAppName": "...", "azureResourceGroup": "..." }

Option C — Environment: AZURE_STATIC_WEB_APP_NAME and AZURE_RESOURCE_GROUP
`)
    process.exit(1)
  }

  const tokenRes = run('az', [
    'staticwebapp',
    'secrets',
    'list',
    '--name',
    name,
    '--resource-group',
    rg,
    '--query',
    'properties.apiKey',
    '-o',
    'tsv',
  ])
  const token = tokenRes.out
  if (!token) {
    console.error('Could not read deployment token. Check az login, name/RG, and permissions.')
    process.exit(1)
  }

  const ghRepoSlug = resolveGhRepoSlug(pkg)
  if (!ghRepoSlug) {
    console.error('Set package.json repository.url or git remote origin to a github.com URL for gh secret set.')
    process.exit(1)
  }

  const ghCheck = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' })
  if (ghCheck.status !== 0) {
    console.error('Install GitHub CLI and run: gh auth login\nhttps://cli.github.com/')
    console.error('\nDeployment token (set GitHub secret AZURE_STATIC_WEB_APPS_API_TOKEN manually):\n')
    console.log(token)
    process.exit(2)
  }

  const set = spawnSync('gh', ['secret', 'set', 'AZURE_STATIC_WEB_APPS_API_TOKEN', '--repo', ghRepoSlug], {
    input: token,
    encoding: 'utf8',
  })
  if (set.status !== 0) {
    console.error(set.stderr || set.error || 'gh secret set failed')
    process.exit(set.status ?? 1)
  }

  console.log(`Set AZURE_STATIC_WEB_APPS_API_TOKEN on ${ghRepoSlug}. Next push to main or frase-annual-review will deploy.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
