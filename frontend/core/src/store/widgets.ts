import { defineStore } from 'pinia'
const LS_KEY_FOR_DATA = 'dashboard'

const saved = localStorage.getItem(LS_KEY_FOR_DATA) || ''

export const useWidgetsStore = defineStore('counter', {
    state: () => ({
      widgets: saved ? JSON.parse(saved) : [],
      widgetToEdit: {}
    }),
    getters: {
      count: (state) => state.widgets.length
    },
    actions: {
      replace(id, newData){
        const index = this.widgets.findIndex(w => w.id === id)
        this.widgets[index] = newData
      },
      setWidgetToEdit(index){
        this.widgetToEdit = this.widgets[index]
      },
      clearWidgetToEdit(){
        this.widgetToEdit = {}
      },
      reorder(index, isUp){

        if(index === 0 && isUp === -1) return;
        if(this.widgets.length === index-1 && isUp === 1) return;

        let element = this.widgets[index];
        this.widgets.splice(index, 1);
        this.widgets.splice(index + isUp, 0, element);
      },
      clear() {
        this.widgets = []
      },
      add(item){
        this.widgets.push(item)
      },
      removeByIndex(index) {
        this.widgets.splice(index, 1)
      }
    },
  })
