import { cli_error, cli_log } from '../helpers/logging'
import { setupSSL } from '../helpers/ssl'
import { JL } from '../types/project'
import { setupDocker } from '../helpers/docker'
import fs from 'fs'

export async function install() {
	const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
	const project: JL = json.jl

	if(project.apps){
		cli_log(`Found ${project.apps.length} apps in package.json`)

		for (const app of project.apps) {
			if (app.domain) {
	
				//replaced with public A record pointing to 121.0.0.1
				//await setupDomain(app)
	
				if (app.ssl) {
					await setupSSL(app)
				}
			}
		}
	}

	if (project.doppler) {
		// TODO this is not working right now... need to see how to get doppler to work with the CLI
		//await setupDoppler(project)
		cli_error(`Doppler needs to be run manually for now`)
	}

	if (project.docker) {
		await setupDocker(project)
	}

	cli_log(`Install complete!`)
}
