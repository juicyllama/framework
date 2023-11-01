<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WidgetDisplayContainer from './WidgetDisplayContainer.vue'
import WidgetEditorContainer from './WidgetEditorContainer.vue'
import { loadWidgets } from '../../services/widgets'
import { useWidgetsStore } from '../../store/widgets'

const props = defineProps<{
	editable: boolean
	endpoint?: string
	data?: any
	account_id?: string
}>()

const dashboardData = ref({})
const widgetsStore = useWidgetsStore()

onMounted(async () => {
	if (props.endpoint) {
		dashboardData.value = await loadWidgets(props.endpoint)
		widgetsStore.setWidgets(dashboardData.value)
	} else {
		dashboardData.value = props.data
		widgetsStore.setWidgets(dashboardData.value)
	}

})
</script>
<template>
	<WidgetEditorContainer v-if="props.editable" :data="dashboardData" :endpoint="props.endpoint" />
	<WidgetDisplayContainer v-else />
</template>
