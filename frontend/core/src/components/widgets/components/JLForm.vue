<template>
	<JLForm {...props.config}></JLForm>
</template>
<script lang="ts" setup>
import { JLForm } from '@/index'

const props = defineProps({
	config: Object,
})
</script>
