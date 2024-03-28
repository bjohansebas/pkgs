export function addCommand() {
  const options = this.opts()

  // TODO: Show a prompt to select the tool to add
  if (Object.keys(options).length === 0) {
    return
  }

  if (options.L != null && options.L !== true) {
    console.log(options.L)
  }

  if (options.F != null && options.F !== true) {
    console.log(options.F)
  }

  if (options.Gh != null && options.Gh !== true) {
    console.log(options.Gh)
  }
}
