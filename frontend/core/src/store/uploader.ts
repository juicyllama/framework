import { defineStore } from 'pinia'

export const useUploaderStore = defineStore('uploader', {
	state: () => ({
		step: 1,
		file: null,
		urls: [],
		encoding: 'utf-8',
		delimeters: {},
		columnsToPick: [],
		allowedFileType: '',
		importMode: '',
		mappers: [],
		uploadResult: {
			status: 'LOADING',
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
		setFileType(fileExt) {
			this.allowedFileType = fileExt
		},
		setFile(file) {
			this.file = file
		},
		setUploadResult(data) {
			this.uploadResult = data
		},
		setImportMode(importMode) {
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
