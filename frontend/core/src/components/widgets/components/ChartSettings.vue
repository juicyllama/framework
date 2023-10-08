<template>
	<q-select v-model="val.subtype" :options="types" label="Chart type" />
</template>
<script setup lang="ts">
// !!! currently not used
// in future if move from direct JSON config to
// UI config of a widget each type of widget this will have JLChart settings
import { reactive } from 'vue'
const val = reactive({
	subtype: '',
})
const types = ['Bar', 'Pie']
</script>
