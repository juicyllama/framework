import { cli_error, cli_log } from '../helpers/logging'
import { setupDomain } from '../helpers/domains'
import { setupSSL } from '../helpers/ssl'
import { JL } from '../types/project'
//import { setupDoppler } from '../helpers/doppler'
//import { exec } from 'child_process'
import { setupDocker } from '../helpers/docker'
import fs from 'fs'

export async function install() {
	const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
	const project: JL = json.jl

	cli_log(`Found ${project.apps.length} apps in package.json`)

	for (const app of project.apps) {
		if (app.domain) {

			await setupDomain(app)

			if (app.ssl) {
				await setupSSL(app)
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

	if (project.apps.length) {
		cli_log(`Install complete!`)
	}
}
