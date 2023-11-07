<template>
    {{ state }}
    <q-btn color="primary" label="Primary" @click="state = !state"/>
    <QBtn color="secondary" label="Secondary" />
    <LazyQBtn color="amber" glossy label="Amber" />
</template>
<script setup>
import { ref } from 'vue'
const state = ref(false)
</script>
