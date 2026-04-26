#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { resolve, join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const ESM = join(ROOT, 'dist', 'esm')
const OUT = join(ROOT, 'dist', 'cobalt.css')

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (p.endsWith('.css')) yield p
  }
}

const tokensFirst = (a, b) => {
  const aTok = a.includes(`${join('tokens', 'index.css')}`)
  const bTok = b.includes(`${join('tokens', 'index.css')}`)
  if (aTok && !bTok) return -1
  if (!aTok && bTok) return 1
  return a.localeCompare(b)
}

const files = [...walk(ESM)].sort(tokensFirst)
const chunks = files.map((f) => `/* ${relative(ESM, f)} */\n${readFileSync(f, 'utf8').trim()}\n`)
writeFileSync(OUT, chunks.join('\n'))
console.log(`Bundled ${files.length} CSS files → ${relative(ROOT, OUT)}`)
