<template>
	<q-btn @click="openUpload">
		<slot />
	</q-btn>
	<UploadWizard v-model="show" :allowedFileType="allowedFileType" />
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import UploadWizard from './components/UploadWizard.vue'
import { LogSeverity } from '@/types'
import { FILE_TYPES } from './config'
import { logger } from '@/helpers/logger'
const props = defineProps({
	allowedFileType: String,
})

onMounted(() => {
	if (!Object.keys(FILE_TYPES).includes(props.allowedFileType)) {
		logger({ severity: LogSeverity.ERROR, message: `Invalid allowedFileType: ${props.allowedFileType}` })
	}
})

const show = ref(false)

const openUpload = () => {
	show.value = true
}
</script>
