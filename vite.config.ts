import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

const SRC = resolve(__dirname, 'src')

const dirEntries = (group: string) =>
  readdirSync(join(SRC, group))
    .filter((n) => statSync(join(SRC, group, n)).isDirectory())
    .map((name) => [`${group}/${name}/${name}`, join(SRC, group, name, `${name}.tsx`)] as const)

const input = Object.fromEntries([
  ['index', join(SRC, 'index.ts')],
  ...dirEntries('atoms'),
  ...dirEntries('molecules'),
  ...dirEntries('organisms'),
  ...dirEntries('templates'),
  ['provider/CobaltProvider', join(SRC, 'provider', 'CobaltProvider.tsx')],
  ...['Display', 'Heading', 'Body', 'Label', 'Mono'].map(
    (n) => [`typography/${n}`, join(SRC, 'typography', `${n}.tsx`)] as const,
  ),
])

// preserveModules + cssCodeSplit emits CSS assets under `dist/.../assets/` and
// strips the JS-side `import './*.css'` calls (leaving `/* empty css */`
// placeholders). This plugin (1) renames CSS assets back to their source-mirrored
// paths so the dist tree colocates JS + CSS, and (2) reinjects each ESM chunk's
// imported-CSS list as side-effect imports so consumer bundlers tree-shake per
// component automatically. CJS chunks are skipped because Node cannot
// `require()` a CSS file natively — bundler-driven consumers should resolve the
// `import` (ESM) condition, and plain-Node CJS users link `./styles.css`.
function colocateCss(): Plugin {
  const relPath = (fromDir: string, toFile: string) => {
    const fromParts = fromDir ? fromDir.split('/') : []
    const toParts = toFile.split('/')
    let i = 0
    while (i < fromParts.length && i < toParts.length - 1 && fromParts[i] === toParts[i]) i++
    const ups = '../'.repeat(fromParts.length - i)
    const down = toParts.slice(i).join('/')
    const rel = (ups + down) || './' + toParts[toParts.length - 1]
    return rel.startsWith('.') ? rel : './' + rel
  }
  return {
    name: 'cobalt:colocate-css',
    enforce: 'post',
    generateBundle(_, bundle) {
      const renames = new Map<string, string>()
      for (const filename of Object.keys(bundle)) {
        const file = bundle[filename]
        if (file.type !== 'asset') continue
        const m = filename.match(/^assets\/(.+?)(?:-[\w-]+)?\.css$/)
        if (!m) continue
        renames.set(filename, `${m[1]}.css`)
      }
      for (const [oldName, newName] of renames) {
        const file = bundle[oldName]
        delete bundle[oldName]
        file.fileName = newName
        bundle[newName] = file
      }
      for (const [filename, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk') continue
        if (filename.endsWith('.cjs')) continue
        const importedCss: Set<string> | undefined = chunk.viteMetadata?.importedCss
        if (!importedCss || importedCss.size === 0) continue
        const chunkDir = filename.includes('/') ? filename.replace(/\/[^/]+$/, '') : ''
        const stmts: string[] = []
        for (const oldCssPath of importedCss) {
          const cssPath = renames.get(oldCssPath) ?? oldCssPath
          const rel = relPath(chunkDir, cssPath)
          stmts.push(`import '${rel}';`)
        }
        chunk.code = `${stmts.join('\n')}\n${chunk.code}`
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    colocateCss(),
    dts({
      include: ['src'],
      exclude: ['**/*.test.*', '**/*.stories.*'],
      entryRoot: 'src',
      outDir: ['dist/esm', 'dist/cjs'],
    }),
  ],
  build: {
    target: 'es2020',
    sourcemap: true,
    cssCodeSplit: true,
    emptyOutDir: true,
    rollupOptions: {
      input,
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      preserveEntrySignatures: 'strict',
      output: [
        {
          format: 'es',
          dir: 'dist/esm',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
        {
          format: 'cjs',
          dir: 'dist/cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          exports: 'named',
        },
      ],
    },
  },
})
