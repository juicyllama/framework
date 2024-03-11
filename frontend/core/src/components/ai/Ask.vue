<script setup lang="ts">
import { onMounted, reactive, ref, Ref } from 'vue'
import { UserStore } from '../../store/user'
import { useQuasar } from 'quasar'
import { askAi, updateAi } from '../../services/ai'
import { default as JLForm } from '../common/form/Form.vue'
import { JLNotice, NoticeType } from '@juicyllama/utils'
import { Ai, AiSuccessType } from '../../types/ai'
import { FormField, FormFieldButtonType, FormFieldField, FormFieldType, FormViewSettings } from '../../types/form'
import { defaultFormSettings } from '../../components/common/form/defaults'

const userStore = UserStore()
const $q = useQuasar()

const props = defineProps<{
	formSettings?: FormViewSettings
}>()

const form: FormField[] = reactive([])
const ai: Ref<Ai | undefined> = ref(undefined)

const loaded = ref<boolean>(false)
const ai_loading = ref<boolean>(false)
const answer = ref<string | undefined>()
const error = ref<string | undefined>()
const warning = ref<string>(
	`<strong>Warning:</strong> This is powered by AI and therefore the answers should NOT be taken as fact, always double check results.`,
)

function createForm() {
	form.push(
		{
			key: 'question',
			value: userStore?.$state?.preferences?.ai?.question ?? '',
			label: 'Question',
			field: FormFieldField.INPUT,
			type: FormFieldType.TEXT,
			required: false,
			size: {
				mobile: 10,
				tablet: 10,
				desktop: 10,
			},
			settings: props?.formSettings ?? defaultFormSettings,
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

	loaded.value = true
}

async function submittedForm(submitted_form) {
	ai_loading.value = true
	form[1].loading = true
	userStore.setPreference({
		ai: {
			...userStore?.$state?.preferences?.ai,
			question: submitted_form.question,
		},
	})

	ai.value = await askAi(submitted_form.question, $q)

	if (!ai.value?.is_error) {
		error.value = ai.value?.error_message
	}

	answer.value = ai.value.response

	ai_loading.value = false
	form[1].loading = false
}


async function update(data) {
	ai.value = {
		...ai.value,
		...data,
	}
	if(ai.value?.ai_id){
		await updateAi(ai.value.ai_id, data)
	}
}

onMounted(async () => {
	createForm()
})
</script>

<template>
	<q-card>
		<q-card-section>
			<div class="row">
					<JLForm
					class="w-full"
						:options="{ type: 'edit', fields: form }"
						v-if="loaded"
						@submitted-form="submittedForm"></JLForm>
			</div>


			<JLNotice v-if="answer?.length" :type="NoticeType.SUCCESS" :message="answer" />
			<div v-if="answer?.length" class="nps_faces q-mt-sm">
				<q-icon
					name="sentiment_satisfied"
					size="1.5em"
					:color="
						ai?.success === AiSuccessType.USER_HAPPY ||
						![AiSuccessType.USER_NEUTRAL, AiSuccessType.USER_SAD].includes(ai?.success as AiSuccessType)
							? 'positive'
							: ''
					"
					class="cursor-pointer"
					@click="update({ success: AiSuccessType.USER_HAPPY })" />
				<q-icon
					name="sentiment_neutral"
					size="1.5em"
					:color="
						ai?.success === AiSuccessType.USER_NEUTRAL ||
						![AiSuccessType.USER_HAPPY, AiSuccessType.USER_SAD].includes(ai?.success as AiSuccessType)
							? 'warning'
							: ''
					"
					class="on-right cursor-pointer"
					@click="update({ success: AiSuccessType.USER_NEUTRAL })" />
				<q-icon
					name="sentiment_dissatisfied"
					size="1.5em"
					:color="
						ai?.success === AiSuccessType.USER_SAD ||
						![AiSuccessType.USER_HAPPY, AiSuccessType.USER_NEUTRAL].includes(ai?.success as AiSuccessType)
							? 'negative'
							: ''
					"
					class="on-right cursor-pointer"
					@click="update({ success: AiSuccessType.USER_SAD })" />
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
