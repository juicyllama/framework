<template>
	<JLForm :options="props.config as FormSchema"></JLForm>
</template>

<script lang="ts" setup>
import { JLForm } from '../../index'
import { FormSchema } from '../../../types'

const props = defineProps({
	config: Object,
})
</script>
