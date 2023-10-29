<script setup lang="ts">
import { Strings } from '@juicyllama/vue-utils'
import { CustomButton, TableSchema } from '../../../../types'

const props = defineProps<{
	buttons: CustomButton[]
	schema?: TableSchema
	q?: any
}>()

const emit = defineEmits(['customButtonClicked'])

function click(button: CustomButton) {
	button.action({ button: button, q: props.q, schema: props.schema })
	emit('customButtonClicked', button)
}
</script>

<template>
	<div class="JLButtonGroup">
		<q-btn
			v-for="(button, key) in buttons"
			:key="key"
			:class="`JLButton ${button.key ? `JLButton${Strings.capitalize(button.key)}` : ''} ${button.classes ?? ''}`"
			@click="click(button)">
			<q-icon
				v-if="button.icon?.name"
				:name="`${button.icon?.type} ${button.icon?.name}`"
				class="JLIcon" />
			{{ button.label }}
		</q-btn>
	</div>
</template>
