export const splitPath = (path: string) => {
  return path.split('/')
}

export const getFileOfPath = (paths: string[]) => {
  return paths.map((value) => {
    const splitValue = value.split('/')
    return splitValue[splitValue.length - 1]
  })
}
