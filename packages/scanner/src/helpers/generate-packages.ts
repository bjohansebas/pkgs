import groupBy from 'object.groupby'

export function generatePackages(packages: string[], files: string[], root: string) {
  const cwd = root.replace('/', '').split('/')

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
