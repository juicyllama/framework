<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
	FormCustomButton,
	FormField,
	FormFieldButtonType,
	FormFieldField,
	FormFieldPlugin,
	FormFieldType,
	FormViewDesignSettings,
	FormSchema,
	InstalledApp,
	LogSeverity,
} from '../../../types'
import { useQuasar } from 'quasar'
import { inputEmailNotRequired, inputEmailRequired, inputRequired } from '../../../helpers/validators'
import { logger } from '../../../helpers/logger'
import { pipeFormData } from '../../../helpers/pipes'
import { default as Telephone } from '../../../components/common/form/plugins/Telephone.vue'
import { default as InstalledAppButton } from '../../../components/common/form/plugins/InstallApp.vue'
import countries from '../../../assets/json/countries.json'
import languages from '../../../assets/json/languages.json'
import { JLNotice, NoticeType, Strings } from '@juicyllama/vue-utils'

const props = defineProps<{
	options: FormSchema
}>()

const emit = defineEmits([
	'updatedField',
	'updateFormField',
	'submittedForm',
	'pluginPhoneNumber',
	'pluginInstalledApp',
])
const $q = useQuasar()
const formData = reactive({})

function buildFormData() {
	for (const field of props.options.fields) {
		if (formData[field.key] !== field.value) {
			formData[field.key] = field.value
		}

		if (!formData[field.key] && field.default) {
			formData[field.key] = field.default
		}
	}
}

function updatedField(value: string) {
	logger({ severity: LogSeverity.VERBOSE, message: `Updated JLForm field ${value} to ${formData[value]}` })
	emit('updatedField', formData[value])
	emit('updateFormField', { [value]: formData[value] })
}

async function buttonPressed(button: FormCustomButton) {
	logger({ severity: LogSeverity.VERBOSE, message: `Form Button Pressed`, object: button })
	
	if(button.type){
		switch (button.type) {
			case FormFieldButtonType.ACTION:
				button.action({ button: button, formData: formData, schema: props.options, q: $q })
				break
		}
	}else{
		submittedForm()
	}
	
}

async function submittedForm() {
	logger({ severity: LogSeverity.VERBOSE, message: `Submitted JLForm with data: `, table: formData })
	const data = pipeFormData(formData, props.options.fields)
	emit('submittedForm', data)
}

function showSelected(field: FormField) {
	let selected = field.dropdown.find(option => option.value === formData[field.key])
	return selected?.label ?? selected?.value
}

function showSelectedCountry(field: FormField) {
	let selected = countries.find(option => option.value === formData[field.key])
	return selected?.label ?? selected?.value
}

function showSelectedLanguage(field: FormField) {
	let selected = languages.find(option => option.value === formData[field.key])
	return selected?.label ?? selected?.value
}

function showSelectedForMultiple(field: FormField) {
	const modelItems = formData[field.key]
	if (modelItems) {
		const modelValues = modelItems.map(m => field.dropdown.find(i => i?.value === m))
		if (modelValues.length) {
			return modelValues.map(i => i?.label).join()
		}
	}
	return ''
}

function phoneNumberUpdated(value: any, field: FormField) {
	formData[field.key] = value
	updatedField(field.key)
	emit('pluginPhoneNumber', {
		integration_name: FormFieldPlugin.TELEPHONE,
		value: value,
		field: field,
		formData: formData,
	})
}

function installedApp(installed_app: InstalledApp, field: FormField) {
	emit('pluginInstalledApp', {
		integration_name: FormFieldPlugin.INSTALL_APP,
		field: field,
		formData: formData,
		installed_app: installed_app,
	})
	updatedField(field.key)
}

watch(
	() => props.options,
	() => {
		buildFormData()
	},
)

buildFormData()

if (props.options.onFormLoad) {
	props.options.onFormLoad({ formData: formData, schema: props.options, q: $q })
}
</script>

<template>
	<div id="JLForm">
		<q-form @submit="submittedForm" class="row">
			<div
				v-for="field in props.options?.fields"
				:key="field.key"
				:class="`JLFormItem JLFormItem${Strings.capitalize(field.field)} JLFormItem${Strings.capitalize(
					field.key,
				)} col-xs-${field.size?.mobile ?? 12} col-sm-${field.size?.tablet ?? 12} col-md-${
					field.size?.desktop ?? 12
				}`">
				<div
					v-if="field.settings?.stack_label"
					:class="`JLLabel JLLabel${Strings.capitalize(field.field)} JLLabel${Strings.capitalize(
						field.key,
					)}`">
					{{ field.label }}
				</div>

				<div
					v-if="field.field === FormFieldField.HTML"
					:class="`JLHTML JLHTML${Strings.capitalize(field.field)} JLHTML${Strings.capitalize(
						field.key,
					)} ${field.classes ?? ''}`"
					v-html="field.value"
					>
				</div>

				<q-input
					v-if="field.field === FormFieldField.INPUT"
					v-model="formData[field.key]"
					:label="!field.settings?.stack_label ? field.label : null"
					:type="field.type"
					:name="field.key"
					:step="field.type === FormFieldType.NUMBER ? 'any' : null"
					:min="field.type === FormFieldType.NUMBER ? (field.required ? 1 : 0) : null"
					:placeholder="field.placeholder"
					:input-class="`JLInput JLInput${Strings.capitalize(field.field)} JLInput${Strings.capitalize(
						field.key,
					)} ${field.classes ?? ''}`"
					:dense="field.settings?.dense"
					:counter="field.settings?.counter"
					:hide-bottom-space="field.settings?.hideBottomSpace"
					:lazy-rules="field.settings?.lazy_rules"
					:rules="
						//@ts-ignore
						field.type === FormFieldType.EMAIL
							? field.required
								? inputEmailRequired()
								: inputEmailNotRequired()
							: field.required
							? inputRequired(field)
							: null
					"
					:loading="field.loading"
					:disable="field.disabled"
					:hint="field.hint"
					:outlined="field.settings?.design === FormViewDesignSettings.OUTLINED"
					:filled="field.settings?.design === FormViewDesignSettings.FILLED"
					:standout="field.settings?.design === FormViewDesignSettings.STANDOUT"
					:borderless="field.settings?.design === FormViewDesignSettings.BORDERLESS"
					:rounded="field.settings?.design === FormViewDesignSettings.ROUNDED"
					:rounded-filled="field.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
					:rounded-outlined="field.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
					:rounded-standout="field.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
					:square="field.settings?.design === FormViewDesignSettings.SQUARE"
					:square-filled="field.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
					:square-outlined="field.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
					:square-standout="field.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
					:no-error-icon="field.settings?.no_error_icon"
					@keyup.enter="updatedField(field.key)"
					@blur="updatedField(field.key)"></q-input>

				<q-input 
					v-if="field.field === FormFieldField.TEXTAREA"
					v-model="formData[field.key]"
					:label="!field.settings?.stack_label ? field.label : null"
					:name="field.key"
					type="textarea"
					:placeholder="field.placeholder"
					:input-class="`JLInput JLTextarea JLInput${Strings.capitalize(
						field.field,
					)} JLInput${Strings.capitalize(field.key)} ${field.classes ?? ''}`"
					:dense="field.settings?.dense"
					:hide-bottom-space="field.settings?.hideBottomSpace"
					:lazy-rules="field.settings?.lazy_rules"
					:rules="
						//@ts-ignore
						field.type === FormFieldType.EMAIL
							? field.required
								? inputEmailRequired()
								: inputEmailNotRequired()
							: field.required
							? inputRequired(field)
							: null
					"
					:loading="field.loading"
					:disable="field.disabled"
					:hint="field.hint"
					:no-error-icon="field.settings?.no_error_icon"
					:outlined="field.settings?.design === FormViewDesignSettings.OUTLINED"
					:filled="field.settings?.design === FormViewDesignSettings.FILLED"
					:standout="field.settings?.design === FormViewDesignSettings.STANDOUT"
					:borderless="field.settings?.design === FormViewDesignSettings.BORDERLESS"
					:rounded="field.settings?.design === FormViewDesignSettings.ROUNDED"
					:rounded-filled="field.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
					:rounded-outlined="field.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
					:rounded-standout="field.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
					:square="field.settings?.design === FormViewDesignSettings.SQUARE"
					:square-filled="field.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
					:square-outlined="field.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
					:square-standout="field.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
					@keyup.enter="updatedField(field.key)"
					@blur="updatedField(field.key)"></q-input>

				<q-select 
					v-if="field.field === FormFieldField.DROPDOWN"
					v-model="formData[field.key]"
					:options="field.dropdown"
					:name="field.key"
					:input-class="`JLSelect JLSelect${Strings.capitalize(field.field)} JLSelect${Strings.capitalize(
						field.key,
					)} ${field.classes ?? ''}`"
					:dense="field.settings?.dense"
					:hide-bottom-space="field.settings?.hideBottomSpace"
					:disable="field.disabled"
					:multiple="field.multiple"
					:label="!field.settings?.stack_label ? field.label : null"
					:lazy-rules="field.settings?.lazy_rules"
					:rules="field.required ? inputRequired(field) : null"
					:no-error-icon="field.settings?.no_error_icon"
					:hint="field.hint"
					emit-value
					:outlined="field.settings?.design === FormViewDesignSettings.OUTLINED"
					:filled="field.settings?.design === FormViewDesignSettings.FILLED"
					:standout="field.settings?.design === FormViewDesignSettings.STANDOUT"
					:borderless="field.settings?.design === FormViewDesignSettings.BORDERLESS"
					:rounded="field.settings?.design === FormViewDesignSettings.ROUNDED"
					:rounded-filled="field.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
					:rounded-outlined="field.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
					:rounded-standout="field.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
					:square="field.settings?.design === FormViewDesignSettings.SQUARE"
					:square-filled="field.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
					:square-outlined="field.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
					:square-standout="field.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
					@keyup.enter="updatedField(field.key)"
					@blur="updatedField(field.key)">
					<template v-slot:selected>
						<template v-if="!field.multiple && formData[field.key]">
							{{ showSelected(field) }}
						</template>
						<template v-else-if="field.multiple && formData[field.key]">
							{{ showSelectedForMultiple(field) }}
						</template>
						<template v-else>
							<span
								:class="`JLPlaceholder JLPlaceholder${Strings.capitalize(field.field)}`"
								v-if="field.placeholder && !field.settings?.stack_label && !field.label"
								>{{ field.placeholder }}</span
							><span class="JLPlaceholder" v-else-if="!field.settings?.stack_label && !field.label"
								>Choose an option</span
							>
						</template>
					</template>
				</q-select>

				<q-select 
					v-if="field.field === FormFieldField.COUNTRY_DROPDOWN"
					v-model="formData[field.key]"
					:options="countries"
					:name="field.key"
					:input-class="`JLSelect JLSelect${Strings.capitalize(field.field)} JLSelect${Strings.capitalize(
						field.key,
					)} ${field.classes ?? ''}`"
					:dense="field.settings?.dense"
					:hide-bottom-space="field.settings?.hideBottomSpace"
					:disable="field.disabled"
					:multiple="field.multiple"
					:label="!field.settings?.stack_label ? field.label : null"
					:lazy-rules="field.settings?.lazy_rules"
					:rules="field.required ? inputRequired(field) : null"
					:no-error-icon="field.settings?.no_error_icon"
					:hint="field.hint"
					emit-value
					:outlined="field.settings?.design === FormViewDesignSettings.OUTLINED"
					:filled="field.settings?.design === FormViewDesignSettings.FILLED"
					:standout="field.settings?.design === FormViewDesignSettings.STANDOUT"
					:borderless="field.settings?.design === FormViewDesignSettings.BORDERLESS"
					:rounded="field.settings?.design === FormViewDesignSettings.ROUNDED"
					:rounded-filled="field.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
					:rounded-outlined="field.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
					:rounded-standout="field.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
					:square="field.settings?.design === FormViewDesignSettings.SQUARE"
					:square-filled="field.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
					:square-outlined="field.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
					:square-standout="field.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
					@keyup.enter="updatedField(field.key)"
					@blur="updatedField(field.key)">
					<template v-slot:selected>
						<template v-if="formData[field.key]">
							{{ showSelectedCountry(field) }}
						</template>
						<template v-else>
							<span
								:class="`JLPlaceholder JLPlaceholder${Strings.capitalize(field.field)}`"
								v-if="field.placeholder && !field.settings?.stack_label && !field.label"
								>{{ field.placeholder }}</span
							><span class="JLPlaceholder" v-else-if="!field.settings?.stack_label && !field.label"
								>Choose an option</span
							>
						</template>
					</template>
				</q-select>

				<q-select 
					v-if="field.field === FormFieldField.LANGUAGE_DROPDOWN"
					v-model="formData[field.key]"
					:options="languages"
					:name="field.key"
					:input-class="`JLSelect JLSelect${Strings.capitalize(field.field)} JLSelect${Strings.capitalize(
						field.key,
					)} ${field.classes ?? ''}`"
					:dense="field.settings?.dense"
					:hide-bottom-space="field.settings?.hideBottomSpace"
					:disable="field.disabled"
					:multiple="field.multiple"
					:label="!field.settings?.stack_label ? field.label : null"
					:lazy-rules="field.settings?.lazy_rules"
					:rules="field.required ? inputRequired(field) : null"
					:no-error-icon="field.settings?.no_error_icon"
					:hint="field.hint"
					emit-value
					:outlined="field.settings?.design === FormViewDesignSettings.OUTLINED"
					:filled="field.settings?.design === FormViewDesignSettings.FILLED"
					:standout="field.settings?.design === FormViewDesignSettings.STANDOUT"
					:borderless="field.settings?.design === FormViewDesignSettings.BORDERLESS"
					:rounded="field.settings?.design === FormViewDesignSettings.ROUNDED"
					:rounded-filled="field.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
					:rounded-outlined="field.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
					:rounded-standout="field.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
					:square="field.settings?.design === FormViewDesignSettings.SQUARE"
					:square-filled="field.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
					:square-outlined="field.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
					:square-standout="field.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
					@keyup.enter="updatedField(field.key)"
					@blur="updatedField(field.key)">
					<template v-slot:selected>
						<template v-if="formData[field.key]">
							{{ showSelectedLanguage(field) }}
						</template>
						<template v-else>
							<span
								:class="`JLPlaceholder JLPlaceholder${Strings.capitalize(field.field)}`"
								v-if="field.placeholder && !field.settings?.stack_label && !field.label"
								>{{ field.placeholder }}</span
							><span class="JLPlaceholder" v-else-if="!field.settings?.stack_label && !field.label"
								>Choose an option</span
							>
						</template>
					</template>
				</q-select>

				<q-toggle
					v-if="field.field === FormFieldField.TOGGLE"
					v-model="formData[field.key]"
					:class="`JLToggle JLToggle${Strings.capitalize(field.field)} JLToggle${Strings.capitalize(
						field.key,
					)} ${field.classes ?? ''}`"
					:checked-icon="field.icon ?? 'done'"
					:color="field.settings?.color ?? 'primary'"
					:label="!field.settings?.stack_label ? field.label : ''"
					:disable="field.disabled"
					:unchecked-icon="field.icon_additional ?? 'close'"
					:hint="field.hint"
					@update:modelValue="updatedField(field.key)" />

				<q-date
					v-if="field.field === FormFieldField.DATE"
					v-model="formData[field.key]"
					:name="field.key"
					mask="YYYY-MM-DD"
					:class="`JLDate JLDate${Strings.capitalize(field.field)} JLDate${Strings.capitalize(field.key)} ${field.classes ?? ''}`"
					:minimal="field.settings?.dense" />

				<JLNotice
					v-if="field.field === FormFieldField.PLUGIN && field.plugin === FormFieldPlugin.NOTICE"
					:type="field.pluginOptions.type as NoticeType"
					:message="'message' in field.pluginOptions ? field.pluginOptions.message : ''"
					:class="field.classes" />

				<Telephone
					v-if="field.field === FormFieldField.PLUGIN && field.plugin === FormFieldPlugin.TELEPHONE"
					:field="field"
					:schema="props.options"
					:icon="props.options.icons"
					:value="formData[field.key]"
					@tel="phoneNumberUpdated($event, field)" />

				<InstalledAppButton
					v-if="field.field === FormFieldField.PLUGIN && field.plugin === FormFieldPlugin.INSTALL_APP"
					:class="`JLPlugin JLPlugin${Strings.capitalize(field.key)} JLPlugin${Strings.capitalize(
						field.plugin,
					)}`"
					:field="field"
					@installed="installedApp($event, field)" />

				<q-input 
					v-if="field.field === FormFieldField.HIDDEN"
					v-model="formData[field.key]"
					:name="field.key"
					:type="field.type"
					:class="`hidden JLHidden JLHidden${Strings.capitalize(field.field)} JLHidden${Strings.capitalize(
						field.key,
					)} ${field.classes ?? ''}`" />

				<div v-if="field.field === FormFieldField.BUTTON && field.buttons.length" class="JLButtonGroup">
					<q-btn
						v-for="(button, key) in field.buttons"
						:class="`${field.settings?.button_style?.classes ?? ''} JLButton JLButton${Strings.capitalize(button.type)} JLButton${Strings.capitalize(
							field.key,
						)} ${field.classes ?? ''} ${button.classes ?? ''}`"
						:key="key"
						:color="(!button?.classes && !field.settings?.button_style?.classes) ? button.color ? button.color : field.settings?.button_style?.color ? field.settings?.button_style?.color : 'primary' : 'primary'"
						:type="button?.type === FormFieldButtonType.SUBMIT ? 'submit' : 'button'"
						:text-color="button?.text_color ?? field.settings?.button_style?.text_color ?? null"
						:size="button?.size ?? field.settings?.button_style?.size ?? null"
						:outline="button?.outline ?? field.settings?.button_style?.outline ?? false"
						:rounded="button?.rounded ?? field.settings?.button_style?.rounded ?? false"
						:flat="button?.flat ?? field.settings?.button_style?.flat ?? false"
						:push="button?.push ?? field.settings?.button_style?.push ?? false"
						:unelevated="button?.unelevated ?? field.settings?.button_style?.unelevated ?? false"
						:square="button?.square ?? field.settings?.button_style?.square ?? false"
						:glossy="button?.glossy ?? field.settings?.button_style?.glossy ?? false"
						:fab="button?.fab ?? field.settings?.button_style?.fab ?? false"
						:fab-mini="button?.fab_mini ?? field.settings?.button_style?.fab_mini ?? false"
						:padding="button?.padding ?? field.settings?.button_style?.padding ?? ''"
						:dense="button?.dense ?? field.settings?.button_style?.dense ?? false"
						:round="button?.round ?? field.settings?.button_style?.round ?? false"
						@click="buttonPressed(button)"
						:disable="field.disabled || field.loading">
						<span
							v-if="field.loading"
							:class="`JLButtonLoader JLButtonLoader${Strings.capitalize(
								field.field,
							)} JLButtonLoader${Strings.capitalize(field.key)} `">
							<q-spinner-dots size="1em" />
						</span>
						<span v-else>
							<q-icon
								v-if="button.icon?.name && !button.icon?.after"
								:name="`${button.icon?.type ? button.icon?.type + ' ' + button.icon?.name : button.icon?.name}`"
								:class="`JLIcon JLIcon${Strings.capitalize(field.key)} q-mr-xs`" />
							<span v-if="button.label">{{ button.label }}</span>
							<span v-else-if="field.label">{{ field.label }}</span>
							<span v-else-if="props.options.type && props.options.name"
								>{{ Strings.capitalize(props.options.type) }}
								{{ Strings.capitalize(props.options.name) }}
							</span>
							<span v-else>Submit</span>
							<q-icon
								v-if="button.icon?.name && button.icon?.after"
								:name="`${button.icon?.type ? button.icon?.type + ' ' + button.icon?.name : button.icon?.name}`"
								:class="`JLIcon JLIcon${Strings.capitalize(field.key)} q-mr-xs`" />
						</span>
					</q-btn>
				</div>

				<div v-if="field.error" class="JLFieldError">
					<div class="q-field__bottom row items-start q-field__bottom--animated">
						<div class="q-field__messages col">
							<div role="alert">
								{{field.error}}
							</div>
						</div>
					</div>
				</div>
			
			</div>
		</q-form>
	</div>
</template>

<style></style>
