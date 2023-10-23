<script setup lang="ts">
import { Ref, ref } from 'vue'
import { FormField, FormFieldPluginTelephoneOptions, FormSchema, IconSettings } from '../../../../types'
import Vue3QTelInput from 'vue3-q-tel-input'

const props = defineProps<{
	schema: FormSchema
	field: FormField
	value: string
	icon?: IconSettings
}>()

defineEmits(['tel'])
const phone: Ref<string> = ref(props.value)

const pluginOptions = <FormFieldPluginTelephoneOptions>props.field.pluginOptions
</script>
<template>
	<vue3-q-tel-input
		:dropdown-options="pluginOptions"
		:default-country="pluginOptions.defaultCountry"
		v-model:tel="phone"
		:search-icon="`${props.icon?.type ?? 'fa-duotone'} ${props.icon?.icons?.search ?? 'fa-magnifying-glass'}`"
		use-icon
		@update:tel="$emit('tel', $event)" />
</template>
