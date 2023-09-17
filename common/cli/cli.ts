#!/usr/bin/env ts-node

import os from 'os'
import yargs from 'yargs/yargs'
import ipt from 'ipt'
import { version } from './package.json'
import { cli_error, cli_log } from './helpers/logging'
import { Script } from './scripts.enums'
import { install } from './scripts/install'

const sep = os.EOL

function getMainArgs() {
	let i = -1
	const result = []
	const mainArgs = process.argv.slice(2)
	while (++i < mainArgs.length) {
		if (mainArgs[i] === '--') break
		result.push(mainArgs[i])
	}
	return result
}

async function runScript(script: Script) {
	cli_log(`Running script ${script}`)
	switch (script) {
		case Script.install:
			await install()
			cli_log(`Install complete!`)
			break

		default:
			cli_error(`Script ${script} not implemented`)
			break
	}
}

async function run() {
	cli_log(`JL Cli v${version}`)

	//check if arguments were passed else run interactive mode
	const { argv } = yargs(getMainArgs())

	if (argv._.length > 0) {
		runScript(Script[argv._[0]])
	} else {
		ipt(Object.values(Script), {
			message: 'Select a script to run',
			separator: sep,
		})
			.then(async (keys) => {
				await runScript(keys[0])
			})
			.catch(() => {
				cli_error(`Error building interactive interface`)
			})
	}
}

run()
