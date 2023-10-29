import { exec } from 'child_process'
import { cli_error, cli_log } from './logging'
import { currentPath, fileExists } from './files'
import { App } from '../types/apps'
import path from 'path'

async function createSSL(app: App) {
	cli_log(`Creating SSL certificate for ${app.domain}`)
	const command = `current_dir=$PWD;cd $PWD/${app.ssl};mkcert ${app.domain};cd $current_dir;`
	exec(command, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr} (${stdout})`)
			return
		}
		cli_log(`SSL certificate created for ${app.domain}`)
	})
}

export async function setupSSL(app: App) {
	const file = path.resolve(currentPath, app.ssl, `${app.domain}-key.pem`)

	if (!fileExists(file)) {
		await createSSL(app)
	}
}
