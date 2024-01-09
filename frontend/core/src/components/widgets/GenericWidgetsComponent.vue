<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WidgetDisplayContainer from './WidgetDisplayContainer.vue'
import WidgetEditorContainer from './WidgetEditorContainer.vue'
import { SettingsService } from '../../services/settings'
import { useWidgetsStore } from '../../store/widgets'
// import { loadWidgets } from '../../services/widgets'

const props = defineProps<{
	editable: boolean
	data?: any
	account_id?: string
}>()

const widgetsStore = useWidgetsStore()
const settingsService = new SettingsService()
const route = useRoute()

onMounted(async () => {
	//format: frontend::widgets::<route>::<account_id>
	const widgetKey = `frontend::widgets::${String(route.name)}::${props.account_id}`

	if (!props.editable) {
		if (props.data) {
			widgetsStore.setWidgets(props.data)
		} else {
			settingsService.getKey(widgetKey).then(data => {
				if (data) {
					widgetsStore.setWidgets(data)
				}
			})
		}
	}
})
</script>
<template>
	<WidgetEditorContainer v-if="props.editable" />
	<WidgetDisplayContainer v-else />
</template>
