/**
 * Creates the GitHub repo (if missing) and pushes the current branch.
 *
 * Token (first match):
 *   1. $env:GITHUB_TOKEN or $env:GH_TOKEN
 *   2. deploy.local.json → "githubToken" (file is gitignored — never commit)
 *
 * Repo name (first match):
 *   $env:GITHUB_REPO_NAME → deploy.local.json → "repoName" → package.json repository URL → default
 *
 * Remote branch to update (first match):
 *   $env:GITHUB_PUSH_BRANCH → deploy.local.json → "pushRemoteBranch" → package.json "saltair".pushRemoteBranch → "main"
 *
 * Usage:
 *   $env:GITHUB_TOKEN = "ghp_…"
 *   npm run github:auto
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathsFromScriptDir } from './repo-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { repoRoot, appRoot: root } = pathsFromScriptDir(__dirname)

const apiHeaders = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'frase-protection-annual-review-deploy',
}

function loadJsonFile(p) {
  if (!fs.existsSync(p)) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

function loadDeployLocal() {
  const p = path.join(root, 'deploy.local.json')
  return loadJsonFile(p) || {}
}

function loadPackageJson() {
  return loadJsonFile(path.join(root, 'package.json')) || {}
}

function repoNameFromPackage(pkg) {
  const url = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url
  if (!url || typeof url !== 'string') return ''
  const m = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/i)
  if (!m) return ''
  return m[2].replace(/\.git$/i, '')
}

const local = loadDeployLocal()
const pkg = loadPackageJson()

const token =
  process.env.GITHUB_TOKEN || process.env.GH_TOKEN || (typeof local.githubToken === 'string' ? local.githubToken.trim() : '')

const repoName =
  process.env.GITHUB_REPO_NAME ||
  (typeof local.repoName === 'string' && local.repoName.trim() ? local.repoName.trim() : '') ||
  repoNameFromPackage(pkg) ||
  'frase-protection-annual-review'

const pushRemoteBranch =
  process.env.GITHUB_PUSH_BRANCH ||
  (typeof local.pushRemoteBranch === 'string' && local.pushRemoteBranch.trim() ? local.pushRemoteBranch.trim() : '') ||
  (typeof pkg.saltair?.pushRemoteBranch === 'string' && pkg.saltair.pushRemoteBranch.trim()
    ? pkg.saltair.pushRemoteBranch.trim()
    : '') ||
  'main'

function git(args, { allowFailure = false } = {}) {
  const r = spawnSync('git', args, { cwd: repoRoot, stdio: 'inherit', encoding: 'utf8' })
  if (r.status !== 0 && !allowFailure) {
    process.exit(r.status ?? 1)
  }
  return r.status ?? 0
}

function currentBranch() {
  const r = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' })
  if (r.status !== 0) {
    console.error('::error::Not a git repository or detached HEAD')
    process.exit(1)
  }
  return (r.stdout || '').trim()
}

function gitPushToRemote(localRef, remoteBranch) {
  if (remoteBranch === localRef) {
    git(['push', '-u', 'origin', localRef])
  } else {
    git(['push', '-u', 'origin', `${localRef}:${remoteBranch}`])
  }
}

async function main() {
  if (!token) {
    console.error(
      'Missing GitHub token. Use one of:\n' +
        '  • $env:GITHUB_TOKEN = "ghp_…"  (classic PAT with "repo", or fine-grained repo access)\n' +
        '  • Add "githubToken" to deploy.local.json (same folder as package.json; gitignored)\n' +
        'Create a token: https://github.com/settings/tokens\n',
    )
    process.exit(1)
  }

  const auth = { Authorization: `Bearer ${token}` }

  const userRes = await fetch('https://api.github.com/user', {
    headers: { ...apiHeaders, ...auth },
  })
  if (!userRes.ok) {
    console.error('GitHub API GET /user failed:', userRes.status, await userRes.text())
    process.exit(1)
  }
  const { login } = await userRes.json()

  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: { ...apiHeaders, ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: repoName,
      private: true,
      auto_init: false,
    }),
  })

  const raw = await createRes.text()
  let errJson = null
  try {
    errJson = raw ? JSON.parse(raw) : null
  } catch {
    /* plain text error */
  }

  if (createRes.ok) {
    console.log('Created repository:', `https://github.com/${login}/${repoName}`)
  } else if (createRes.status === 422) {
    const msg = errJson?.message || raw || ''
    const exists =
      /already exists/i.test(msg) ||
      (Array.isArray(errJson?.errors) &&
        errJson.errors.some((e) => String(e?.message || '').toLowerCase().includes('already')))

    if (!exists) {
      console.error('Create repo failed (422):', raw)
      process.exit(1)
    }
    console.log('Repository already exists, pushing…')
  } else {
    console.error('Create repo failed:', createRes.status, raw)
    process.exit(1)
  }

  const cleanOrigin = `https://github.com/${login}/${repoName}.git`
  const enc = encodeURIComponent(token)
  const authOrigin = `https://x-access-token:${enc}@github.com/${login}/${repoName}.git`

  git(['remote', 'remove', 'origin'], { allowFailure: true })
  git(['remote', 'add', 'origin', authOrigin])

  const localRef = currentBranch()
  console.log(`Pushing ${localRef} → origin/${pushRemoteBranch} …`)

  try {
    gitPushToRemote(localRef, pushRemoteBranch)
  } finally {
    git(['remote', 'set-url', 'origin', cleanOrigin])
  }

  console.log('')
  console.log('Done:', `https://github.com/${login}/${repoName}`)
  console.log('Next: GitHub repo → Settings → Secrets → AZURE_STATIC_WEB_APPS_API_TOKEN (see DEPLOY.md).')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
