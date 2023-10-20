import { defineStore } from 'pinia'

export const useUploaderStore = defineStore('uploader', {
	state: () => ({
		step: 1,
		file: {},
		urls: [],
		encoding: 'utf-8',
		delimeters: {},
		collumnsToPick: [],
		importMode: '',
		mappers: {},
		uploadResult: {
			status: 'LOADING',
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
		setDelimetersData(data) {
			this.delimeters = data
		},
		setFieldMappings(data) {
			this.mappers = data
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
		setNextStep() {
			this.step++
		},
	},
})
