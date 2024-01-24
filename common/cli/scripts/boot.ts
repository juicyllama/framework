import { checkIfInstalled } from '../helpers/pkm'

export async function boot() {
        await checkIfInstalled('jq', 'brew')
        await checkIfInstalled('mkcert', 'brew')
        await checkIfInstalled('pnpm', 'npm')
        await checkIfInstalled('npx', 'pnpm')
        await checkIfInstalled('ts-node', 'pnpm')
}