<script setup lang="ts">
import {onMounted, ref} from 'vue'
import WidgetDisplayContainer from './WidgetDisplayContainer.vue'
import WidgetEditorContainer from './WidgetEditorContainer.vue'
import {loadWidgets} from '@/services/widgets'

const props = defineProps<{
	editable: boolean,
	account_id: string
}>()

const dashboardData = ref({})

onMounted(async () => {
	dashboardData.value = await loadWidgets()
})
</script>
<template>
	<WidgetEditorContainer v-if="props.editable" :data="dashboardData"/>
	<WidgetDisplayContainer v-else  :data="dashboardData"/>
</template>
