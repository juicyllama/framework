import {cli_error} from "../helpers/logging";
import { jl } from '../package.json'
import {setupDomain} from "../helpers/domains";
import {setupSSL} from "../helpers/ssl";
import {JL} from "../helpers/project";
import {setupDoppler} from "../helpers/doppler";
import {exec} from "child_process";

export async function start(){

	const project  = <JL>jl

	for(const app of project.apps){
		if(app.domain) {
			await setupDomain(app)

			if(app.ssl){
				await setupSSL(app)
			}
		}
	}

	if(project.doppler){
		await setupDoppler()
	}

	exec(`pnpm install --shamefully-hoist`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
		}
	})

}