import { defineStore } from 'pinia';

export const useUploaderStore = defineStore('uploader', {
  state: () => ({
    step: 1,
    files: [],
    urls: [],
    encoding: 'utf-8',
    delimeters: {},
    collumnsToPick: [],
    importMode: '',
    existingTables: [],
  }),
  getters: {
    getStep(state) {
      return state.step;
    },
    getTables(state) {
      return state.existingTables.map((i) => i.title);
    },
    getFieldsPerTable: (state) => {
      return (tableName) =>
        state.existingTables.find((i) => i.tableName === tableName);
    },
  },
  actions: {
    setDelimetersData(data) {
      this.delimeters = data;
    },
    setFiles(files) {
      this.files = files;
    },
    setImportMode(importMode) {
      this.importMode = importMode;
    },
    setNextStep() {
      this.step++;
    },
  },
});
