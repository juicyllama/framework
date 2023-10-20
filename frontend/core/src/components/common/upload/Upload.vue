<template>
	<q-btn @click="openUpload">Upload</q-btn>
	<UploadWizard v-model="show" :allow="allowedFileType as FILE_TYPES" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import UploadWizard from './components/UploadWizard.vue'
import { FILE_TYPES } from './config'
defineProps({
	allowedFileType: String,
})

const show = ref(false)

const openUpload = () => {
	show.value = true
}
</script>
