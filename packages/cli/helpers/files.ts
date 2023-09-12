import {exec} from "child_process";
import {cli_error} from "./logging";
import fs from 'fs'

export enum File {
	HOSTS = '/etc/hosts',
}

export const currentPath = process.cwd();

export function fileExists(location: string): boolean {
	return fs.existsSync(location)
}

export function writeToFile(file: File, content: string){
	exec(`	echo ${content} | sudo tee -a ${file} >/dev/null`, (error, stdout, stderr) => {
		if (error) {
			cli_error(`error: ${error.message}`)
		}
		if (stderr) {
			cli_error(`stderr: ${stderr}`)
		}
		return
	})
}