import groupBy from 'object.groupby'

export function generatePackages(packages: string[], files: string[]) {
  const cwd = process.cwd().replace('/', '').split('/')
  const namePackages = packages.map((name) => {
    return name.replace('/', '').split('/').slice(cwd.length).join('/')
  })

  const filterFiles = groupBy(files, (file) => {
    let i = '.'

    // biome-ignore lint/complexity/noForEach: <explanation>
    namePackages.forEach((name) => {
      if (file.startsWith(name)) {
        i = name
        return
      }
    })
    return i ? i : '.'
  })

  return filterFiles
}
