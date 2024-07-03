import { type Options, defineConfig } from 'tsup'

export default defineConfig((options: Options) => ({
  entry: {
    index: 'src/index.ts',
    helpers: 'src/helpers/index.ts',
  },
  minify: !options.watch,
  format: ['cjs', 'esm'],
  dts: true,
  shims: true,
  clean: true,
  ...options,
}))
