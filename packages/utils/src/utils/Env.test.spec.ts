import { Env } from './Env'
import * as path from 'path'
describe('Env', () => {
	it('setEnvValue', async () => {
		Env.setEnvValue({
			key: 'NODE_ENV',
			value: 'development',
			envPath: './',
			fileName: path.resolve(__dirname, 'env.env'),
		})
	})

	it('getEnvValue', async () => {
		const result = Env.getEnvValue({
			key: 'NODE_ENV',
			envPath: './',
			fileName: path.resolve(__dirname, 'env.env'),
		})
		expect(result).toEqual('development')
	})
})
