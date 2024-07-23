import prompts from 'prompts'

export async function addCommand(tools: string[]) {
  const projectPath = process.cwd()

  if (tools.length === 0) {
    const { type } = await prompts([
      {
        type: 'multiselect',
        name: 'type',
        message: 'Select type of tools to add',
        choices: [
          { title: 'Linter', value: 'linter' },
          { title: 'Formatter', value: 'formatter' },
        ],
      },
    ])

    if (!Array.isArray(type)) {
      return
    }

    // TODO: if select biome, ask if want to formatter
    if (type.includes('linter')) {
      const { linter } = await prompts([
        {
          type: 'select',
          name: 'linter',
          message: 'Select linter to add',
          choices: [
            { title: 'Biome', value: 'biome' },
            { title: 'ESLint', value: 'eslint' },
          ],
        },
      ])
    }

    if (type.includes('formatter')) {
      const { formatter } = await prompts([
        {
          type: 'select',
          name: 'formatter',
          message: 'Select linter to add',
          choices: [
            { title: 'Biome', value: 'biome' },
            { title: 'Prettier', value: 'prettier' },
          ],
        },
      ])
    }

    return
  }
}
