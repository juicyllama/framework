<script setup lang="ts">
import { NoticeProps } from '../types'

const props = defineProps<NoticeProps>()
</script>

<template>
	<div :class="`notice notice--${props.type}`">
		<p><span v-html="props.message"></span></p>
	</div>
</template>

<style scoped></style>
