import path from 'path'
import { exec } from 'child-process-promise'

import { App } from '../types/apps'

import { cli_error, cli_log } from './logging'
import { currentPath, fileExists } from './files'

async function createSSL(app: App) {
	cli_log(`Creating SSL certificate for ${app.domain}`)
	const command = [
		'current_dir=$PWD',
		`cd $PWD/${app.ssl}`,
		`mkcert ${app.domain}`,
		'cd $current_dir',
	].join('; ')

	try {
		await exec(command);

		cli_log(`SSL certificate created for ${app.domain}`)
	} catch (e) {
		cli_error(`SSL certificate for ${app.domain} not created. Error: ${e.message}`);
	}
}

export async function setupSSL(app: App) {
	const file = path.join(currentPath(), app.ssl, `${app.domain}-key.pem`)

	if (!fileExists(file)) {
		await createSSL(app)
	}
}
