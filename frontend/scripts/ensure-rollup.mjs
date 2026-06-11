/**
 * HBuilderX on Apple Silicon often runs as x64 (Rosetta) and needs
 * @rollup/rollup-darwin-x64 even when npm install runs on arm64.
 */
import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rollupVersion = '4.61.1'
const packages = [
  '@rollup/rollup-darwin-arm64',
  '@rollup/rollup-darwin-x64'
]

for (const pkg of packages) {
  const pkgPath = join(root, 'node_modules', pkg)
  if (!existsSync(pkgPath)) {
    console.log(`[postinstall] installing missing ${pkg}@${rollupVersion}`)
    execSync(`npm install ${pkg}@${rollupVersion} --save-dev --force`, {
      cwd: root,
      stdio: 'inherit'
    })
  }
}
