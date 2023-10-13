<template>
	<q-btn @click="openUpload">Upload</q-btn>
	<UploadWizard v-model="show" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import UploadWizard from './components/UploadWizard.vue'

const show = ref(false)

const openUpload = () => {
	show.value = true
}
</script>
