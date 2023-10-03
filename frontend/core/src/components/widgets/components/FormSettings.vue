<template>
    <template v-for="field in options.fields" :key="field.id">
        <q-select v-model="field.field" :options="types" label="Field type" />
        <q-btn @click="removeField(field.id)">Remove field</q-btn>
    </template>
    <q-btn @click="addField">Add field</q-btn>
</template>
<script setup>
import { v4 as uuidv4 } from 'uuid'
/**
 * JLForm API from
 * https://github.com/juicyllama-npm/quasar/blob/main/src/components/common/form/Form.vue
 */

// props.options.fields
//  = {
//     'key': '', // id
//     'size': '', // Enum
//     'field': '', // type
//     'label': '', // String
//     'required': false,
//     'counter': false,
//     'dense': false,
//     'outlined': false,
//     'disabled': false,
//     'lazy_rules': '' // Array
// }
const options = reactive({
    fields: []
})
const types = ['Input', 'Select', 'Telephone']
const addField = () => {
    // todo
    options.fields.push({
        id: uuidv4()
    })
}
const removeField = (id) => {
    // todo
}
</script>
