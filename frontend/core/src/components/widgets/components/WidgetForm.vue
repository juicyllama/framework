<template>
	<q-card bordered class="q-pa-xs" style="width: 700px; max-width: 80vw">
		<q-card-section class="row">
			<div class="text-h6 col-11 text-center">Widget properties</div>
			<q-btn dense flat icon="close" @click="emit('close')" class="col-1">
				<q-tooltip class="bg-white text-primary">close</q-tooltip>
			</q-btn>
		</q-card-section>
		<q-separator />
		<q-card-section>
			<q-form @submit="onSubmit" class="q-gutter-md">
				<q-input
					filled
					v-model="options.data.name"
					label="Widget name"
					lazy-rules
					:rules="[val => (val && val.length > 0) || 'Please type something']" />
				<q-input filled v-model="options.data.description" label="Widget description" />
				<q-select v-model="options.data.content" :options="optionsContent" label="Content" />

				<AdditionalSettings @change="onChange" :type="options.data.content" />

				<q-select v-model="options.data.size" :options="optionsSizeArr" label="Size" />
				<q-input filled v-model="options.data.page" label="Page to display" />
				<q-card-actions align="right">
					<q-btn @click="onSubmit" color="primary">{{ isEdit ? 'Save' : 'Create' }}</q-btn>
					<q-btn text flat @click="emit('close')">close</q-btn>
				</q-card-actions>
			</q-form>
		</q-card-section>
	</q-card>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useWidgetsStore } from '../../../store/widgets'
import AdditionalSettings from './AdditionalSettings.vue'
import { optionsContent, optionsSizeArr, EMPTY_WIDGET } from '../constants'

const emit = defineEmits(['close', 'add'])

const widgetsStore = useWidgetsStore()

const onSubmit = () => {
	if (!isEdit.value) {
		widgetsStore.add({
			...options.value.data,
			id: uuidv4(),
			order: 0,
		})
	} else {
		widgetsStore.replace(widgetsStore.widgetToEdit.id, options.value.data)
		widgetsStore.clearWidgetToEdit()
	}
	options.value.data = EMPTY_WIDGET
	emit('add')
}

const onChange = (value: string): void => {
	options.value.data.configs = JSON.stringify(value)
}

const isEdit = computed<boolean>(() => !!widgetsStore.widgetToEdit.id)
const options = computed<any>(() => {
	if (isEdit.value) {
		return {
			data: widgetsStore.widgetToEdit,
		}
	} else {
		return {
			data: EMPTY_WIDGET,
		}
	}
})
</script>
