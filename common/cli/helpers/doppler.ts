import { currentPath, fileExists } from './files'
import { cli_error, cli_log } from './logging'
import { exec } from 'child_process'
import { JL } from '../types/project'

async function login(project: JL): Promise<boolean> {
	exec(`doppler login --debug`, (error, stdout, stderr) => {
		if (error) {
			console.error(`error: ${error.message}`)
			return
		}

		if (stderr) {
			console.error(`stderr: ${stderr}`)
			return
		}

		console.log(`stdout:\n${stdout}`)
	})

	exec(
		`doppler setup --no-interactive -p ${project.doppler.project} -c ${project.doppler.config}`,
		async (error, stdout, stderr) => {
			console.log(error, stdout, stderr)

			if (error) {
				cli_error(`error: ${stderr}`)
				return false
			}

			console.log(stdout)
		},
	)

	return true
}

async function sync() {
	exec(`doppler secrets --json > secrets.json`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
		}
	})

	exec(
		`jq -r 'to_entries|map("\\(.key)=\\(.value.computed|tostring)")|.[]' secrets.json > .env`,
		async (error, stdout, stderr) => {
			if (error) {
				cli_error(`error: ${stderr}`)
			}
		},
	)

	exec(`rm -rf secrets.json`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
		}
	})

	exec(`export $(grep -v '^#' .env)`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
		}
	})

	cli_log('Secrets Installed')
}

export async function setupDoppler(project: JL) {
	let authed = false

	if (!fileExists(currentPath + '.env')) {
		cli_log(`Login to Doppler for fetching .env secrets`)
		authed = await login(project)
	}

	if (!authed) {
		cli_error(`Doppler authentication failed`)
		return
	}

	await sync()
}
