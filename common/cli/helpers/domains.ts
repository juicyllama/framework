import { exec } from 'child-process-promise'
import { cli_log } from './logging'
import { File, writeToFile } from './files'
import { App } from '../types/apps'

async function writeDomain(domain: string) {
	cli_log(`Installing ${domain} into hosts file`)
	await writeToFile(File.HOSTS, `127.0.0.1 ${domain}`)
	await writeToFile(File.HOSTS, `::1 ${domain}`)
}

export async function setupDomain(app: App) {

	const command = `ping -c 1 "${app.domain}"`

	let result

	try{
		result = await exec(command)
	}catch(e: any){
		await writeDomain(app.domain)
		return
	}

	if (result.error) {
		await writeDomain(app.domain)
		return
	}

	if (result.stderr.startsWith('PING')) {
		await writeDomain(app.domain)
		return
	} 

	if (result.stdout.startsWith('PING')) {
		return
	} else {
		await writeDomain(app.domain)
		return
	}

}
