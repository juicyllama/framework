<template>
    <q-card bordered class="q-pa-xs" style="width: 700px; max-width: 80vw;">
        <q-card-section class="row">
          <div class="text-h6 col-11 text-center">Widget properties</div>
          <q-btn dense flat icon="close" @click="emit('close')" class="col-1">
            <q-tooltip class="bg-white text-primary">close</q-tooltip>
          </q-btn>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            >
                <q-input
                    filled
                    v-model="options.data.name"
                    label="Widget name"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                />
                <q-input
                    filled
                    v-model="options.data.description"
                    label="Widget description"
                />
                <q-select v-model="options.data.content" :options="optionsContent" label="Content" />

                <AdditionalSettings v-if="options.data.content !== ''" :type="options.data.content"/>

                <q-select v-model="options.data.size" :options="optionsSize" label="Size" />
                <q-input
                    filled
                    v-model="options.data.page"
                    label="Page to display"
                />
                <q-card-actions align="right">
                    <q-btn @click="onSubmit" color="primary">{{ isEdit ? 'Save' : 'Create' }}</q-btn>
                    <q-btn text flat @click="emit('close')">close</q-btn>

                </q-card-actions>
        </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import {computed, reactive} from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useWidgetsStore } from '@/stores/widgets'
import AdditionalSettings from './AdditionalSettings.vue'

const EMPTY_WIDGET = {
    content: '',
    name: '',
    size: '',
    description: '',
    page: '',
    configs: '',
}

const emit = defineEmits(['close'])
const optionsContent = ['', 'JLTable','JLForm','JLStats','JLChart']
const optionsSize = ['SMALL','MEDIUM','LARGE']

const widgetsStore = useWidgetsStore()

const onSubmit = () => {
    if(!isEdit.value) {
        widgetsStore.add({
            ...options.data,
            id: uuidv4(),
            order: 0
        })
    } else {
        widgetsStore.replace(widgetsStore.widgetToEdit.id, options.data)
        widgetsStore.clearWidgetToEdit()
    }
    options.data = {}
    emit('close')
}

const isEdit = computed(() => !!widgetsStore.widgetToEdit.id)
const options = reactive({
    data: isEdit.value ? widgetsStore.widgetToEdit : EMPTY_WIDGET
})

</script>
