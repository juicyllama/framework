<template>
	<template v-for="field in options.fields" :key="field.id">
		<q-select v-model="field.field" :options="types" label="Field type" />
		<q-btn @click="removeField(field.id)">Remove field</q-btn>
	</template>
	<q-btn @click="addField">Add field</q-btn>
</template>
<script setup lang="ts">
// !!! currently not used
// in future if move from direct JSON config to
// UI config of a widget each type of widget this will have JLForm settings
import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
const options = reactive({
	fields: [],
})
const types = ['Input', 'Select', 'Telephone']
const addField = () => {
	// todo
	options.fields.push({
		id: uuidv4(),
	})
}
const removeField = id => {
	// todo
}
</script>
