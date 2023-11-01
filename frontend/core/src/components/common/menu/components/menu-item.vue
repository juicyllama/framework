<script setup lang="ts">
import { MenuItem } from '../../../../types'

const props = defineProps<MenuItem>()
defineEmits(['click'])
</script>

<template>
	<q-item-section v-if="props.icon" style="flex: none; font-size: medium">
		<q-icon :name="props.icon" class="JLMenuItemIcon icon_fix q-pr-sm" />
	</q-item-section>

	<q-item-section>
		<q-item-label class="JLMenuItemTitle">{{ props.title }} </q-item-label>
		<q-item-label caption class="JLMenuItemCaption">
			{{ props.caption }}
		</q-item-label>
	</q-item-section>
</template>
