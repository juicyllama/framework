import {currentPath, fileExists} from "./files";
import {cli_error, cli_log} from "./logging";
import {exec} from "child_process";

async function login(): Promise<boolean>{
	exec(`doppler login`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
			return false
		}
	})

	exec(`doppler setup --no-interactive`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
			return false
		}
	})

	return true
}

async function sync(){

	exec(`doppler secrets --json > secrets.json`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
		}
	})

	exec(`jq -r 'to_entries|map("\\(.key)=\\(.value.computed|tostring)")|.[]' secrets.json > .env`, async (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${stderr}`)
		}
	})

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

}

export async function setupDoppler() {

	let created = false
	let authed = true

	if (!fileExists(currentPath + '.env')) {
		cli_log(`Login to Doppler for fetching .env secrets`)
		authed = await login()
		created = true
	}

	if (!authed) {
		cli_error(`Doppler authentication failed`)
		return
	}

	await sync()

	if (created) {
		cli_log('Secrets Installed')
	} else {
		cli_log('Secrets Updated')
	}

}