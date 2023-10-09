<template>
	<q-card-section class="q-pt-none q-pb-none">
		<div class="text-weight-bold">What delimiter separates your field? Select the appropriate delimiter.</div>
	</q-card-section>
	<q-card-section>
		<q-select
			label="Record Delimiter"
			:options="recordDelimiters"
			v-model="chosenRecordDelimiter"
			style="max-width: 35%" />
		<q-option-group :options="options" type="radio" v-model="chosen" />
	</q-card-section>
	<q-card-section>
		<div class="row" style="max-width: 250px">
			<q-select
				label="Field Delimiter"
				class="col-9 q-mr-sm"
				:options="fieldDelimiters"
				v-model="chosenFieldDelimiter" />
		</div>
		<q-select
			style="max-width: 150px"
			:options="textQualifiers"
			v-model="chosenTextQualifier"
			label="Text Qualifier" />
	</q-card-section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUploaderStore } from '@/store/uploader'

const store = useUploaderStore()

const options = [
	{
		label: 'Delimited - Characters such as comma or tab separate each field',
		value: 'delimited',
	},
	{
		label: 'Fixed Width - Fields are aligned in columns with spaces between each field',
		value: 'fixedWidth',
	},
]
const chosen = ref(null)

const recordDelimiters = ['CRLF', 'CR', 'LF']
const chosenRecordDelimiter = ref(recordDelimiters[0])

const fieldDelimiters = ['Tab', 'Semicolon(;)', 'Comma(,)', 'Space', 'Other Symbol']
const chosenFieldDelimiter = ref(fieldDelimiters[2])

const textQualifiers = ['"', "'", '`', '~']
const chosenTextQualifier = ref(textQualifiers[0])

watch(
	[chosenTextQualifier, chosenFieldDelimiter, chosenRecordDelimiter],
	(textQualifier, fieldDelimiter, recordDelimiter) => {
		store.setDelimetersData({
			textQualifier,
			fieldDelimiter,
			recordDelimiter,
		})
	},
)
</script>

<style scoped></style>
