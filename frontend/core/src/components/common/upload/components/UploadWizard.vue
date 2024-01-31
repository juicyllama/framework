<template>
	<q-dialog v-model="isOpen">
		<q-card class="upload-wizard q-pa-md column">
			<q-card-section class="card row justify-between q-pt-none q-pb-none">
				<div class="text-center title col-10 text-weight-bold">Import Wizard</div>
				<q-btn dense flat icon="close" v-close-popup @click="$emit('update:modelValue')" class="card-exit">
					<q-tooltip class="bg-white text-primary">Close</q-tooltip>
				</q-btn>
			</q-card-section>
			<q-separator class="q-pa-none" />
			<q-card-section class="q-pr-none q-pl-none">
				<FirstScreen v-if="store.getStep === 1" />
				<SecondScreen v-else-if="store.getStep === 2" />
				<ThirdScreen v-else-if="store.getStep === 3" />
				<FourthScreen v-else-if="store.getStep === 4" />
				<FifthScreen v-else :uploadResult="uploadResult" />
			</q-card-section>
			<q-card-actions class="footer q-pb-none">
				<WizardFooter
					:is-back-active="isBackButtonActive"
					:is-next-active="isNextButtonActive"
					:is-start-active="isStartButtonActive"
					@on-back-button-clicked="onBackButtonClicked"
					@on-next-button-clicked="onNextButtonClicked"
					@on-start-button-clicked="onStartButtonClicked" />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue'
import WizardFooter from './WizardFooter.vue'
import FirstScreen from './FirstScreen.vue'
import SecondScreen from './SecondScreen.vue'
import ThirdScreen from './ThirdScreen.vue'
import FourthScreen from './FourthScreen.vue'
import FifthScreen from './FifthScreen.vue'

import { uploadFile } from '../../../../services/upload'
import { useUploaderStore } from '../../../../store/uploader'

const store = useUploaderStore()

const emit = defineEmits(['update:show', 'update:modelValue'])
const props = defineProps({
	show: Boolean,
	allowedFileType: String,
	endpoint: String,
	columnsToPick: Array<string>,
})
const uploadResult = ref(null)

const isOpen = computed({
	get() {
		return props.show
	},
	set() {
		emit('update:show', false)
	},
})

const isNextButtonActive = computed(() => {
	return store.getStep != 5
})
const isBackButtonActive = computed(() => {
	return store.getStep
})
const isStartButtonActive = computed(() => {
	return store.getStep == 5
})

const onNextButtonClicked = () => {
	if (store.getStep == 1 && (!store.getFile || store.getFile.file == null)) {
		return
	}
	store.setNextStep()
}
const onBackButtonClicked = () => {
	store.setPrevStep()
}

onMounted(() => {
	store.setFileType(props.allowedFileType)
	store.setColumnsToPick(props.columnsToPick)
})

watch(screen, () => {
	if (store.getStep === 5) {
		onStartButtonClicked()
	}
})
const onStartButtonClicked = async () => {
	const resultingMap = {}
	store.mappers.forEach(line => {
		resultingMap[line.source] = line.target || line.source
	})

	const form = new FormData()
	form.append('file', store.getFile.file as Blob)
	form.append('upload_type', props.allowedFileType)
	form.append('mappers', JSON.stringify(resultingMap))
	form.append('import_mode', store.importMode)

	try {
		// await uploadMetadata({
		// 	upload_type: props.allowedFileType, turn on the
		// 	mappers: store.mappers,
		// 	import_mode: store.importMode,
		// })

		const res = await uploadFile(props.endpoint, form)
		uploadResult.value = {
			status: 'SUCCESS',
			details: res.data,
		}
	} catch (e) {
		console.log(e)
		uploadResult.value = {
			status: 'ERROR',
			details: e,
		}
	} finally {
		store.setStep(5)
		store.setUploadResult(uploadResult.value)
	}
}
</script>
<style>
.upload-wizard {
	min-width: 75%;
	min-height: 85%;
	position: relative;
}
.footer {
	height: auto;
	position: absolute;
	bottom: 30px;
	width: 95%;
}
.title {
	font-size: 18px;
	height: 20px;
	padding-top: 10px;
}
</style>
