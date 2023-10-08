<script setup lang="ts">
import {onMounted, ref} from 'vue'
import WidgetDisplayContainer from './WidgetDisplayContainer.vue'
import WidgetEditorContainer from './WidgetEditorContainer.vue'
import {WidgetsService} from '@/services/widgets'

const props = defineProps<{
	editable: boolean,
	account_id: string
}>()

const service = new WidgetsService()
const dashboardData = ref({})

onMounted(() => {
	dashboardData.value = await service.findAll({
		account_id: props.account_id
	})
}),
</script>
<template>
	<WidgetEditorContainer v-if="props.editable" :data="dashboardData"/>
	<WidgetDisplayContainer v-else  :data="dashboardData"/>
</template>
