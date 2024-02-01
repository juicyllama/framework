import { defineStore } from 'pinia'
import { FILE_TYPES } from 'src/components/common/upload/config'

export enum UploadMode {
	'CREATE' = 'CREATE',
	'UPSERT' = 'UPSERT',
	'DELETE' = 'DELETE',
	'REPOPULATE' = 'REPOPULATE',
}

export enum UploadStatus {
	'IDLE' = 'IDLE',
	'LOADING' = 'LOADING',
	'ERROR' = 'ERROR',
	'SUCCESS' = 'SUCCESS',
}

type UploaderStoreState = {
	step: number
	file: any
	urls: Array<string>
	encoding: string
	delimeters: {
		[key: string]: string
	}
	columnsToPick: Array<string>
	allowedFileType: FILE_TYPES | null
	importMode: UploadMode
	mappers: Array<{
		source: string,
		target: string,
		primaryKey: boolean
	}>
	uploadResult: {
		status: UploadStatus
		details: any
	}
}

export const useUploaderStore = defineStore('uploader', {
	state: (): UploaderStoreState => ({
		step: 1,
		file: null,
		urls: [],
		encoding: 'utf-8',
		delimeters: {},
		columnsToPick: [],
		allowedFileType: null,
		importMode: UploadMode.UPSERT,
		mappers: [],
		uploadResult: {
			status: UploadStatus.IDLE,
			details: {},
		},
	}),
	getters: {
		getStep(state) {
			return state.step
		},
		getFile(state) {
			return state.file
		},
		getMappers(state) {
			return state.mappers
		},
		getPrimaryKey(state) {
			return state.mappers.find((mapper) => mapper.primaryKey)?.target
		},
		getUploadResult(state) {
			return state.uploadResult
		}
	},
	actions: {
		setColumnsToPick(data: Array<string>) {
			this.columnsToPick = data
		},
		setDelimetersData(data) {
			this.delimeters = data
		},
		setFieldMappings(data) {
			this.mappers = data
		},
		setFileType(fileExt: FILE_TYPES) {
			this.allowedFileType = fileExt
		},
		setFile(file) {
			this.file = file
		},
		setUploadResult(data: {
			status: UploadStatus
			details: any
		}) {
			this.uploadResult = data
		},
		setImportMode(importMode: UploadMode) {
			this.importMode = importMode
		},
		setStep(step: number) {
			this.step = step
		},
		setPrevStep() {
			this.step--
		},
		setNextStep() {
			this.step++
		},
	},
})
