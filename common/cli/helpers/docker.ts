import { currentPath, fileExists } from './files'
import { cli_error, cli_log } from './logging'
import { exec } from 'child_process'
import { sync } from 'read-pkg'
import { JL } from './project'

async function build(): Promise<boolean> {
	exec(`pnpm run docker:build`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
			return false
		}
	})
	return true
}

export async function setupDocker(project: JL) {
	const created = build()

	if (created) {
		cli_log('Docker Built')
	}
}
