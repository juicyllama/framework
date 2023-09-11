<script setup lang="ts">
import { DropdownButtonMenu } from '@/types'
import { JLMenu } from '@/components/common/menu'

const props = defineProps<DropdownButtonMenu>()
</script>

<template>
	<q-btn-dropdown :color="props.button?.color ?? 'primary'" :label="props.button?.label ?? 'Options'">
		<JLMenu :menu="props.menu"></JLMenu>
	</q-btn-dropdown>
</template>
