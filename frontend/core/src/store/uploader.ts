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
		existingTables: [],
		uploadResult: {
			status: 'LOADING'
		},
	}),
	getters: {
		getStep(state) {
			return state.step
		},
		getFile(state) {
			return state.file
		},
		getTables(state) {
			return state.existingTables.map(i => i.title)
		},
		getFieldsPerTable: state => {
			return tableName => state.existingTables.find(i => i.tableName === tableName)
		},
	},
	actions: {
		setDelimetersData(data) {
			this.delimeters = data
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
