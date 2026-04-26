#!/usr/bin/env node
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SRC = join(ROOT, 'src')
const PKG = join(ROOT, 'package.json')

const dirComponents = (group) =>
  readdirSync(join(SRC, group))
    .filter((n) => statSync(join(SRC, group, n)).isDirectory())
    .map((name) => ({ subpath: `./${name}`, distRel: `${group}/${name}/${name}` }))

const typographyComponents = ['Display', 'Heading', 'Body', 'Label', 'Mono'].map((name) => ({
  subpath: `./${name}`,
  distRel: `typography/${name}`,
}))

const components = [
  ...dirComponents('atoms'),
  ...dirComponents('molecules'),
  ...dirComponents('organisms'),
  ...dirComponents('templates'),
  { subpath: './CobaltProvider', distRel: 'provider/CobaltProvider' },
  ...typographyComponents,
]

const subpathEntry = (distRel) => ({
  types: `./dist/esm/${distRel}.d.ts`,
  import: `./dist/esm/${distRel}.js`,
  require: `./dist/cjs/${distRel}.cjs`,
})

const exports = {
  '.': {
    types: './dist/esm/index.d.ts',
    import: './dist/esm/index.js',
    require: './dist/cjs/index.cjs',
  },
  ...Object.fromEntries(components.map((c) => [c.subpath, subpathEntry(c.distRel)])),
  './tokens': './dist/esm/tokens/index.css',
  './styles.css': './dist/cobalt.css',
  './package.json': './package.json',
}

const check = process.argv.includes('--check')
const pkg = JSON.parse(readFileSync(PKG, 'utf8'))
const current = JSON.stringify(pkg.exports, null, 2)
const next = JSON.stringify(exports, null, 2)

if (check) {
  if (current !== next) {
    console.error('package.json#exports is out of date. Run: node scripts/gen-exports.mjs')
    process.exit(1)
  }
  console.log('package.json#exports is up to date.')
  process.exit(0)
}

pkg.exports = exports
writeFileSync(PKG, JSON.stringify(pkg, null, 2) + '\n')
console.log(`Wrote ${Object.keys(exports).length} exports entries to package.json`)
