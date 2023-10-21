import { exec } from 'child_process'
import { cli_error, cli_log } from './logging'
import { File, writeToFile } from './files'
import { App } from './apps'

async function writeDomain(domain: string) {
	cli_log(`Installing ${domain} into hosts file`)
	writeToFile(File.HOSTS, `127.0.0.1 ${domain}`)
	writeToFile(File.HOSTS, `::1 ${domain}`)
}

export async function setupDomain(app: App) {
	exec(`ping -c 1 "${app.domain}"`, async (error, stdout, stderr) => {
		if (error) {
			await writeDomain(app.domain)
			return
		}
		if (stderr) {
			cli_error(`stderr: ${stderr}`)
			return
		}

		if (stdout.startsWith('PING')) {
			return
		} else {
			await writeDomain(app.domain)
		}
	})
}
