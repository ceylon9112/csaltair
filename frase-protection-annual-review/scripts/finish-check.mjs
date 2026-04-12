/**
 * Verifies deployment wiring (remote, workflow, optional gh secret names).
 * Run: npm run deploy:check
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathsFromScriptDir } from './repo-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { repoRoot, appRoot: root } = pathsFromScriptDir(__dirname)

function readPkg() {
  return JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
}

function githubSlug(url) {
  if (!url) return null
  const m = String(url).match(/github\.com[/:]([^/]+)\/([^/.]+)/i)
  if (!m) return null
  return `${m[1]}/${m[2].replace(/\.git$/i, '')}`
}

function ok(msg) {
  console.log(`  OK  ${msg}`)
}

function bad(msg) {
  console.log(`  NO  ${msg}`)
}

function warn(msg) {
  console.log(`  !!  ${msg}`)
}

function secretListed(stdout, name) {
  return stdout.includes(name) && stdout.split('\n').some((line) => line.split(/\s/)[0] === name)
}

function main() {
  console.log('Frase deploy — readiness check\n')

  const wfMonorepo = path.join(repoRoot, '.github', 'workflows', 'frase-azure-static-web-apps.yml')
  const wfStandalone = path.join(repoRoot, '.github', 'workflows', 'azure-static-web-apps.yml')
  if (fs.existsSync(wfMonorepo)) ok('Workflow .github/workflows/frase-azure-static-web-apps.yml exists')
  else if (fs.existsSync(wfStandalone)) ok('Workflow .github/workflows/azure-static-web-apps.yml exists')
  else bad('Missing Frase Azure Static Web Apps workflow')

  const pkg = readPkg()
  const repoUrl = pkg.repository?.url
  const slug = githubSlug(repoUrl || '')
  if (slug) ok(`package.json repository → ${slug}`)
  else bad('package.json repository.url should be a github.com URL')

  const remote = spawnSync('git', ['remote', 'get-url', 'origin'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
  if (remote.status === 0 && remote.stdout?.trim()) {
    const o = githubSlug(remote.stdout.trim())
    if (o && slug && o === slug) ok(`git origin matches package.json (${o})`)
    else if (o) warn(`git origin (${o}) differs from package.json (${slug || '?'})`)
    else ok('git remote origin is set')
  } else bad('No git remote origin')

  const branch = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
  const upstream = spawnSync('git', ['rev-parse', '--abbrev-ref', '@{u}'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
  if (branch.status === 0) {
    const b = branch.stdout.trim()
    const u = upstream.status === 0 ? upstream.stdout.trim() : ''
    ok(`Current branch: ${b}${u ? ` (upstream: ${u})` : ''}`)
  }

  const gh = spawnSync('gh', ['--version'], { encoding: 'utf8' })
  if (gh.status !== 0) {
    warn('GitHub CLI (gh) not installed — cannot list repository secrets from here.')
    console.log('\n  Deploy: add secret AZURE_CREDENTIALS on GitHub (see DEPLOY.md). Optional: gh auth login && npm run deploy:check\n')
    return
  }

  if (!slug) return

  const list = spawnSync('gh', ['secret', 'list', '--repo', slug], { encoding: 'utf8' })
  if (list.status !== 0) {
    warn(`Could not list secrets: ${list.stderr || list.stdout}`)
    return
  }

  const out = list.stdout
  const hasCreds = secretListed(out, 'AZURE_CREDENTIALS')
  const hasToken = secretListed(out, 'AZURE_STATIC_WEB_APPS_API_TOKEN')

  if (hasCreds) ok('GitHub secret AZURE_CREDENTIALS is set (CI deploys without local Azure CLI)')
  else if (hasToken) ok('GitHub secret AZURE_STATIC_WEB_APPS_API_TOKEN is set (legacy deploy path)')
  else {
    bad('No deploy secret: add AZURE_CREDENTIALS (recommended) or AZURE_STATIC_WEB_APPS_API_TOKEN')
    console.log('\n  See DEPLOY.md §3 — configure in GitHub repo Settings → Secrets.\n')
  }

  console.log('')
}

main()
