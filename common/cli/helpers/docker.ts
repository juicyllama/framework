import { cli_error, cli_log } from './logging'
import { exec } from 'child_process'

async function build(): Promise<boolean> {
	exec(`pnpm run start:docker:build`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr} (${stdout})`)
			return false
		}
	})
	return true
}

export async function setupDocker() {
	const created = build()

	if (created) {
		cli_log('Docker Built')
	}
}
