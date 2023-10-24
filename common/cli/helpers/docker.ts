import { cli_error, cli_log } from './logging'
import { exec } from 'child-process-promise'
import { JL } from '../types/project'

export async function setupDocker(project: JL) {

	let docker_name = project.project_name

	if(typeof project.docker === 'string'){
		docker_name = project.docker
	}

	cli_log(`Builing Docker ${docker_name}...`)


	const command = `docker-compose --project-name ${docker_name} up --build --detach`
	const result = await exec(command)

	if(result.error){
		cli_error(`error: ${result.stderr} (${result.stdout})`)
		return
	}
	
	cli_log(`Docker ${docker_name} built!`)
	
}
