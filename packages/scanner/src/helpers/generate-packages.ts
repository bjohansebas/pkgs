import groupBy from 'object.groupby'
import { findPackageJson } from './scan-files'

/**
 * Generates packages based on the provided files and root directory.
 *
 * @param files - An array of strings representing file paths.
 * @param root - A string representing the root directory.
 * @returns An array of objects containing path and files for each package.
 */
export function generatePackages(files: string[], root?: string) {
  const packages = findPackageJson(files)

  const cwd = root ? root.replace('/', '').split('/') : process.cwd().replace('/', '').split('/')

  const namePackages = packages.map((name) => {
    return name.replace('/', '').split('/').slice(cwd.length).join('/')
  })

  const filterFiles = groupBy(files, (file) => {
    let groupName = '.'

    for (const name of namePackages) {
      if (file.startsWith(name)) {
        groupName = name
      }
    }

    return groupName ? groupName : '.'
  })

  const mapPackages = Object.entries(filterFiles).map((value) => {
    const remap: { path: string; files: string[] } = {
      path: value[0],
      files: [],
    }

    for (const file of value[1]) {
      remap.files.push(file)
    }
    return remap
  })

  return mapPackages
}
