import instance from './index'
import { DeepPartial, QVueGlobals } from 'quasar'
import { logger } from '../helpers/logger'
import { LogSeverity } from '../types/common'
import { Ai } from '../types/ai'
import { accountStore } from '../index'

export async function askAi(question: string, q?: QVueGlobals): Promise<Ai> {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
	try {
		
			const response = await instance.post(`ai/ask`, {
				question: question,
			})
			return response.data
		
	} catch (e: any) {
		logger({ severity: LogSeverity.ERROR, message: e.message(), q: q })
	}
}

export async function updateAi(ai_id: number, data: DeepPartial<Ai>, q?: QVueGlobals): Promise<Ai> {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
	try {
		const response = await instance.patch(`ai/update/${ai_id}`, data)
		logger({ severity: LogSeverity.LOG, message: `Update Successful!`, q: q })
		return response.data
	} catch (e: any) {
		logger({ severity: LogSeverity.ERROR, message: e.message(), q: q })
	}
}
