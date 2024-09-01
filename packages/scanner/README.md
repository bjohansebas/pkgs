# @rapidapp/scanner

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]

> A simple scan the technologies used in a TypeScript/JavaScript project

## Install

```sh
npm install @bjohansebas/scanner
```

## Usage


```js
import { generateReport } from '@bjohansebas/scanner'
import { scanFolder } from '@bjohansebas/scanner/helpers'

const files = await scanFolder(process.cwd())

const report = await generateReport(files)
```

## API

### generateReport(files, config)

#### files

Type: `string[]`

> The files that belong to the project can be obtained using [scanFolder](#scanfolderroot) to get the project files.

#### config (optional)

Type: `object`

Scanned project path

##### config.root

Type: `string`\
Default: `process.cwd()`

##### config.checkContent (optional)

Type: `boolean` (optional)\
Default: `false`

Check the contents of the files to determine each configuration

##### config.checkDependencies (optional)

Type: `boolean` (optional)\
Default: `true`

Check if it is listed as a dependency in the package.json

### scanFolder(root)

#### root

Type: `string`

Path where it will start searching for all files

## License

[Mozilla Public License Version 2.0](https://github.com/bjohansebas/pkgs/blob/main/LICENSE)

[npm-install-size-image]: https://badgen.net/packagephobia/install/@bjohansebas/scanner
[npm-install-size-url]: https://packagephobia.com/result?p=%40bjohansebas%2Fscanner
[npm-url]: https://npmjs.com/package/@bjohansebas/scanner
[npm-version-image]: https://badgen.net/npm/v/@bjohansebas/scanner