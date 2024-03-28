import { type Options, defineConfig } from 'tsup'

export default defineConfig((options: Options) => ({
  entry: {
    index: 'src/index.ts',
    helpers: 'src/helpers/index.ts',
  },
  minify: true,
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  ...options,
}))
