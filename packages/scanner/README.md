# @rapidbuild/scanner

A simple CLI scan the technologies used in a TypeScript/JavaScript project.

## Usage CLI

### Installation

```bash
npm i -g rapidbuild
```

### Usage

```bash
rapidbuild scan <project-directory>
```

### Output

```json
[
    "name": "project-name",
    "packages": [
        {
            "name":"package-name",
            "languages": ["typescript","javascript"],
            "linters": ["eslint"],
            "formatter": ["prettier"],
        }
    ],
    "languages": ["typescript","javascript"],
    "package_manager": "pnpm",
    "linters": ["biome"],
    "formatter": ["biome"],
]
```