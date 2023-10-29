<script setup lang="ts">
import { onMounted, reactive, ref, Ref } from 'vue'
import { UserStore } from '../../store/user'
import { useQuasar } from 'quasar'
import { askLana, updateLana } from '../../services/lana'
import { default as JLForm } from '../common/form/Form.vue'
import { JLNotice, NoticeType } from '@juicyllama/vue-utils'
import { Lana, LanaSuccessType } from '../../types/lana'
import { FormField, FormFieldButtonType, FormFieldField, FormFieldType, FormSettings } from '../../types/form'
import { defaultFormSettings } from '../../components/common/form/defaults'

const userStore = UserStore()
const $q = useQuasar()

const props = defineProps<{
	sql_enabled?: boolean
	filters: {
		label: string
		checked_icon: string
		unchecked_icon: string
	}
	formSettings?: FormSettings
}>()

const lanaFilters: Ref<boolean> = ref(false)
const form: FormField[] = reactive([])
const filtersForm: FormField[] = reactive([])
let lana: Lana = reactive(null)

const loaded = ref<boolean>(false)
const ai_loading = ref<boolean>(false)
const answer = ref<string>('')
const error = ref<string>('')
const warning = ref<string>(
	`<strong>Warning:</strong> This is powered by AI and therefore the answers should NOT be taken as fact, always double check results.`,
)

function createForm() {
	form.push(
		{
			key: 'question',
			value: userStore?.$state?.preferences?.lana?.question ?? '',
			label: 'Question',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			size: {
				mobile: 10,
				tablet: 10,
				desktop: 10,
			},
			settings: props?.formSettings?.field?.settings ?? defaultFormSettings.field.settings,
			loading: false,
		},
		{
			key: 'submit',
			label: 'Ask',
			field: FormFieldField.BUTTON,
			buttons: [
				{
					type: FormFieldButtonType.SUBMIT,
				},
			],
			size: {
				mobile: 2,
				tablet: 2,
				desktop: 2,
			},
			loading: ai_loading.value,
		},
	)

	if (props.sql_enabled) {
		filtersForm.push({
			key: 'sql',
			label: props?.filters?.label ?? 'Query database?',
			field: FormFieldField.TOGGLE,
			icon: props?.filters?.checked_icon,
			icon_additional: props?.filters?.unchecked_icon,
			value: userStore?.$state?.preferences?.lana?.filters?.sql ?? false,
		})
	}

	loaded.value = true
}

async function submittedForm(submitted_form) {
	ai_loading.value = true
	form[1].loading = true
	userStore.setPreference({
		lana: {
			...userStore?.$state?.preferences?.lana,
			question: submitted_form.question,
		},
	})
	lana = await askLana(submitted_form.question, userStore?.$state?.preferences?.lana?.filters?.sql ?? false, $q)

	if (!lana?.is_error) {
		error.value = lana.error_message
	}

	answer.value = lana.sql_result_nl ?? lana.response

	ai_loading.value = false
	form[1].loading = false
}

async function filtersUpdated(form) {
	userStore.setPreference({
		lana: {
			...userStore?.$state?.preferences?.lana,
			filters: {
				sql: form.sql,
			},
		},
	})
}

async function openLanaFilters() {
	lanaFilters.value = !lanaFilters.value
}

async function update(data) {
	lana = {
		...lana,
		...data,
	}
	await updateLana(lana.lana_id, data)
}

onMounted(async () => {
	createForm()
})
</script>

<template>
	<q-card style="width: 500px; max-width: 80vw">
		<q-card-section>
			<div class="row">
				<div class="col-10">
					<JLForm
						:options="{ type: 'edit', fields: form }"
						v-if="loaded"
						@submitted-form="submittedForm"></JLForm>
				</div>
				<div class="col-2">
					<q-btn flat icon="filter_list" @click="openLanaFilters" class="q-ml-sm" />
				</div>
			</div>

			<div class="row q-mt-sm flex-inline" v-if="lanaFilters">
				<div class="col-12">
					<JLForm :options="{ type: 'edit', fields: form }" @updated-field="filtersUpdated"></JLForm>
				</div>
			</div>

			<JLNotice v-if="answer?.length" :type="NoticeType.SUCCESS" :message="answer" />
			<div v-if="answer?.length" class="nps_faces q-mt-sm">
				<q-icon
					name="sentiment_satisfied"
					size="1.5em"
					:color="
						lana.success === LanaSuccessType.USER_HAPPY ||
						![LanaSuccessType.USER_NEUTRAL, LanaSuccessType.USER_SAD].includes(lana.success)
							? 'positive'
							: ''
					"
					class="cursor-pointer"
					@click="update({ success: LanaSuccessType.USER_HAPPY })" />
				<q-icon
					name="sentiment_neutral"
					size="1.5em"
					:color="
						lana.success === LanaSuccessType.USER_NEUTRAL ||
						![LanaSuccessType.USER_HAPPY, LanaSuccessType.USER_SAD].includes(lana.success)
							? 'warning'
							: ''
					"
					class="on-right cursor-pointer"
					@click="update({ success: LanaSuccessType.USER_NEUTRAL })" />
				<q-icon
					name="sentiment_dissatisfied"
					size="1.5em"
					:color="
						lana.success === LanaSuccessType.USER_SAD ||
						![LanaSuccessType.USER_HAPPY, LanaSuccessType.USER_NEUTRAL].includes(lana.success)
							? 'negative'
							: ''
					"
					class="on-right cursor-pointer"
					@click="update({ success: LanaSuccessType.USER_SAD })" />
			</div>
			<JLNotice v-if="error?.length" :type="NoticeType.ERROR" :message="error" />
			<JLNotice :type="NoticeType.WARNING" :message="warning" />
		</q-card-section>
	</q-card>
</template>

<style scoped>
.nps_faces {
	display: flex;
	justify-content: flex-end;
}
</style>
