import { exec } from 'child-process-promise'
import { cli_error } from './logging'
import fs from 'fs'

export enum File {
	HOSTS = '/etc/hosts',
}

export const currentPath = process.cwd()

export function fileExists(location: string): boolean {
	return fs.existsSync(location)
}

export async function writeToFile(file: File, content: string) {

	const command = `echo ${content} | sudo tee -a ${file} >/dev/null`
	const result = await exec(command)

	if(result.error){
		cli_error(`error: ${result.error.message}`)
		return
	}

	if(result.stderr){
		cli_error(`stderr: ${result.stderr}`)
		return
	}
	
	return
}
