import { FormField, FormFieldType, LogSeverity } from '@/types'
import { logger } from './logger'
import { isNotEmptyObject } from 'class-validator'

export function pipeFormData(data: any, schema: FormField[]) {
	try {
		const pippedData = {}

		for (const [key, value] of Object.entries(data)) {
			if (['submit'].includes(key)) {
				delete data[key]
			}

			if (schema.find(col => col.key === key)?.pipeValidator) {
				data[key] = schema.find(col => col.key === key).pipeValidator(value)
				pippedData[key] = schema.find(col => col.key === key).pipeValidator(value)
			} else if (schema.find(col => col.key === key)?.type === FormFieldType.NUMBER) {
				data[key] = Number(value)
				pippedData[key] = Number(value)
			}

			if (isNotEmptyObject(pippedData)) {
				logger({
					severity: LogSeverity.VERBOSE,
					message: `Data transformed via pipeFormData`,
					table: pippedData,
				})
			}
		}
	} catch (error: any) {
		logger({ severity: LogSeverity.ERROR, message: `Error piping form data: ${error.message}`, table: data })
	}

	return data
}
