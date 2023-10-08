<template>
	<q-card bordered flat class="q-pa-sm">
		<div class="row no-wrap" v-if="type !== ''">
			<div class="col">
				<div class="text-subtitle2">Additional settings</div>
				<label>Add config fia JSON</label>
				<br />
				<textarea style="width: 100%; height: 110px" v-model="jsonConfig"></textarea>
			</div>
		</div>

		<!-- <template v-if="type === 'JLForm'">
        </template>
        <template v-if="type === 'JLTable'">
            <TableSettings/>
        </template>
        <template v-if="type === 'JLChart'">
            <ChartSettings/>
        </template> -->
	</q-card>
</template>
<script setup>
import { ref, toRefs, watch } from 'vue'
// import TableSettings from './TableSettings.vue'
// import FormSettings from './FormSettings.vue'
// import ChartSettings from './ChartSettings.vue'

const props = defineProps({
	type: String,
})
const emit = defineEmits(['change'])

const jsonConfig = ref('')
const { type } = toRefs(props)

watch(jsonConfig, val => {
	emit('change', val)
})
</script>
