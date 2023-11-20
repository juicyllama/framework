import { exec } from 'child-process-promise'
import { JL } from '../types/project'
import { cli_error, cli_log } from './logging'

export async function setupDocker(project: JL) {
	let docker_name = project.project_name

	if (typeof project.docker === 'string') {
		docker_name = project.docker
	}

	cli_log(`Building Docker ${docker_name}...`)

	const command1 = `docker kill $(docker ps -q) 2>/dev/null`
	const result1 = await exec(command1)

	if (result1.stderr) {
		cli_error(`error: ${result1.stderr} (${result1.stdout})`)
		return
	}

	const command2 = `docker compose --project-name ${docker_name} up --build --detach`
	const result2 = await exec(command2)

	if (result2.stderr) {
		cli_error(`error: ${result2.stderr} (${result2.stdout})`)
		return
	}

	cli_log(`Docker ${docker_name} built!`)
}
