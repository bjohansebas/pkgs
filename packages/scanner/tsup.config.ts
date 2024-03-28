import { type Options, defineConfig } from 'tsup'

export default defineConfig((options: Options) => ({
  entry: {
    helpers: 'src/helpers/index.ts',
  },
  minify: true,
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  ...options,
}))
