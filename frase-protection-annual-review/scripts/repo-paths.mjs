/**
 * Monorepo-aware paths: git repo root vs Frase app package root (this folder when nested).
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function getGitRepoRoot(startDir = __dirname) {
  const r = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: startDir,
    encoding: 'utf8',
  })
  if (r.status !== 0) return path.join(__dirname, '..')
  return path.resolve((r.stdout || '').trim())
}

/** package.json directory: frase-protection-annual-review/ in monorepo, else repo root (legacy standalone clone). */
export function getFraseAppRoot(repoRoot = getGitRepoRoot()) {
  const nested = path.join(repoRoot, 'frase-protection-annual-review')
  if (fs.existsSync(path.join(nested, 'package.json'))) return nested
  return repoRoot
}

/** @param {string} scriptDir — pass `import.meta` script dirname (e.g. `path.dirname(fileURLToPath(import.meta.url))`). */
export function pathsFromScriptDir(scriptDir = __dirname) {
  const repoRoot = getGitRepoRoot(scriptDir)
  const appRoot = getFraseAppRoot(repoRoot)
  return { repoRoot, appRoot }
}
