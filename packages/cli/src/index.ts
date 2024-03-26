#!/usr/bin/env node

import { Command } from 'commander'
import packageJson from '../package.json'

const program = new Command(packageJson.name).version(packageJson.version)
