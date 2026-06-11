/**
 * HBuilderX on Apple Silicon often runs as x64 (Rosetta).
 * Sync native binaries with the esbuild/rollup versions vite actually resolved.
 * Install arm64 + x64 together so npm does not prune one when adding the other.
 */
import { existsSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function readPkgVersion(relativePath) {
  const pkgJson = join(root, relativePath)
  if (!existsSync(pkgJson)) return null
  return JSON.parse(readFileSync(pkgJson, 'utf8')).version
}

function readInstalledNativeVersion(nativePkg) {
  const pkgJson = join(root, 'node_modules', ...nativePkg.split('/'), 'package.json')
  if (!existsSync(pkgJson)) return null
  return JSON.parse(readFileSync(pkgJson, 'utf8')).version
}

/** vite nests its own esbuild; hoisted esbuild may be older (from uni-cli-shared) */
function readViteEsbuildVersion() {
  return (
    readPkgVersion('node_modules/vite/node_modules/esbuild/package.json') ||
    readPkgVersion('node_modules/esbuild/package.json')
  )
}

function needsNativeSync(nativePkg, expectedVersion) {
  const current = readInstalledNativeVersion(nativePkg)
  return !current || current !== expectedVersion
}

const viteVer = readPkgVersion('node_modules/vite/package.json')
const esbuildVer = readViteEsbuildVersion()
const rollupVer = readPkgVersion('node_modules/rollup/package.json')

const specs = []
if (esbuildVer) {
  if (needsNativeSync('@esbuild/darwin-arm64', esbuildVer)) {
    specs.push(`@esbuild/darwin-arm64@${esbuildVer}`)
  }
  if (needsNativeSync('@esbuild/darwin-x64', esbuildVer)) {
    specs.push(`@esbuild/darwin-x64@${esbuildVer}`)
  }
}
if (rollupVer) {
  if (needsNativeSync('@rollup/rollup-darwin-arm64', rollupVer)) {
    specs.push(`@rollup/rollup-darwin-arm64@${rollupVer}`)
  }
  if (needsNativeSync('@rollup/rollup-darwin-x64', rollupVer)) {
    specs.push(`@rollup/rollup-darwin-x64@${rollupVer}`)
  }
}

if (specs.length > 0) {
  console.log(`[postinstall] syncing native binaries: ${specs.join(', ')}`)
  execSync(`npm install ${specs.join(' ')} --no-save --force`, {
    cwd: root,
    stdio: 'inherit'
  })
}

console.log(
  `[postinstall] vite@${viteVer} → esbuild@${esbuildVer}, rollup@${rollupVer}`
)
