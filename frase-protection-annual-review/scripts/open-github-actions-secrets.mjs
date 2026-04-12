/**
 * Prints the URL for this repo's GitHub Actions secrets (repository settings — not profile settings).
 * Tries to open the browser on Windows / macOS / Linux.
 * Usage: npm run github:open-secrets
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathsFromScriptDir } from './repo-paths.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { appRoot: root } = pathsFromScriptDir(__dirname)

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const url = pkg.repository?.url || ''
const m = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/i)
if (!m) {
  console.error('Set package.json repository.url to a github.com URL.')
  process.exit(1)
}
const owner = m[1]
const repo = m[2].replace(/\.git$/i, '')
const secretsUrl = `https://github.com/${owner}/${repo}/settings/secrets/actions`
const variablesUrl = `https://github.com/${owner}/${repo}/settings/variables/actions`

console.log('')
console.log('Actions secrets live on the REPOSITORY page — not under your profile (github.com/settings/profile).')
console.log('')
console.log('  Secrets:    ' + secretsUrl)
console.log('  Variables:  ' + variablesUrl)
console.log('')
console.log('You need a "Settings" tab on the repo (repository admin). Collaborators without admin cannot add secrets.')
console.log('')

try {
  if (process.platform === 'win32') {
    spawnSync('cmd', ['/c', 'start', '', secretsUrl], { stdio: 'ignore' })
  } else if (process.platform === 'darwin') {
    spawnSync('open', [secretsUrl], { stdio: 'ignore' })
  } else {
    spawnSync('xdg-open', [secretsUrl], { stdio: 'ignore' })
  }
  console.log('Attempted to open the secrets page in your browser.\n')
} catch {
  console.log('Open the Secrets URL manually in your browser.\n')
}
