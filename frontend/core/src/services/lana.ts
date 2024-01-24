import instance from './index'
import { DeepPartial, QVueGlobals } from 'quasar'
import { logger } from '../helpers/logger'
import { LogSeverity } from '../types/common'
import { Lana } from '../types/lana'
import { accountStore } from '../index'

export async function askLana(question: string, sql: boolean, q?: QVueGlobals): Promise<Lana> {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
	try {
		if (sql) {
			const response = await instance.post(`lana/data`, {
				question: question,
				sql: sql,
			})
			return response.data
		} else {
			const response = await instance.post(`lana/ask`, {
				question: question,
			})
			return response.data
		}
	} catch (e: any) {
		logger({ severity: LogSeverity.ERROR, message: e.message(), q: q })
	}
}

export async function updateLana(lana_id: number, data: DeepPartial<Lana>, q?: QVueGlobals): Promise<Lana> {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
	try {
		const response = await instance.patch(`lana/update/${lana_id}`, data)
		logger({ severity: LogSeverity.LOG, message: `Update Successful!`, q: q })
		return response.data
	} catch (e: any) {
		logger({ severity: LogSeverity.ERROR, message: e.message(), q: q })
	}
}
