import type { StorybookConfig } from '@storybook/react-vite'
import type { InlineConfig, Plugin } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(viteConfig: InlineConfig): Promise<InlineConfig> {
    const flatPlugins = (viteConfig.plugins ?? []).flat(Infinity) as Plugin[]
    const filteredPlugins = flatPlugins.filter(
      (p): p is Plugin => Boolean(p) && (p as Plugin).name !== 'cobalt:colocate-css',
    )
    return {
      ...viteConfig,
      base: process.env['STORYBOOK_BASE_URL'] ?? '/',
      plugins: filteredPlugins,
    }
  },
}

export default config
