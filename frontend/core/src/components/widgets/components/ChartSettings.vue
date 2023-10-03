<template>
    <q-select v-model="val.subtype" :options="types" label="Chart type" />
</template>
<script setup>
    import {reactive} from 'vue'
    const val = reactive({
        subtype: ''
    })
    const types = ['Bar', 'Pie']
</script>
