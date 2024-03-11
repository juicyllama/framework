<script setup lang="ts">
//Original code from Scott Windon - Buy him a coffee here: https://www.buymeacoffee.com/scottwindon

import { Ref, ref, onMounted, watch } from 'vue'
import zxcvbn from 'zxcvbn'
import { FormField, FormFieldPluginPasswordGeneratorOptions, FormSchema, FormViewDesignSettings } from '../../../../types'
import { Strings } from '@juicyllama/vue-utils'

const props = defineProps<{
	schema: FormSchema
	field: FormField
	password?: string
}>()

props.field.pluginOptions = <FormFieldPluginPasswordGeneratorOptions>props.field.pluginOptions

const emit = defineEmits(['updated'])

const password: Ref<string> = ref(props.password ?? '')
const passwordScore: Ref<number> = ref(0)
const charsLength: Ref<number> = ref(props.field.pluginOptions?.password_length ?? 12)
const hidePasswordField: Ref<boolean> = ref(true)
const hidePasswordStrength: Ref<boolean> = ref(props.field.pluginOptions?.hide?.password_strength ?? false)
const hidePasswordLength: Ref<boolean> = ref(props.field.pluginOptions?.hide?.password_length ?? false)
const hidePasswordOptions: Ref<boolean> = ref(props.field.pluginOptions?.hide?.password_options ?? false)

const forceCharUppercase: Ref<boolean> = ref(props.field.pluginOptions?.force?.uppercase ?? false)
const forceCharLowercase: Ref<boolean> = ref(props.field.pluginOptions?.force?.lowercase ?? false)
const forceCharNumbers: Ref<boolean> = ref(props.field.pluginOptions?.force?.numbers ?? false)
const forceCharSymbols: Ref<boolean> = ref(props.field.pluginOptions?.force?.symbols ?? false)

const checkedUppercase: Ref<boolean> = ref(true)
const checkedLowercase: Ref<boolean> = ref(true)
const checkedNumbers: Ref<boolean> = ref(true)
const checkedSymbols: Ref<boolean> = ref(true)

const chars = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numeric: '0123456789',
    symbols: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
}

function checkStrength() {
    if(!password.value) return passwordScore.value = 0;
    passwordScore.value = zxcvbn(password.value).score + 1;
}

function generatePassword() {

	if(!checkedLowercase.value && !checkedUppercase.value && !checkedNumbers.value && !checkedSymbols.value) {
		checkedLowercase.value = true
		checkedUppercase.value = true
		checkedNumbers.value = true
		checkedSymbols.value = true
	}

    password.value = shuffleArray(
        (
			(checkedLowercase.value ? chars.lower : '')
			+(checkedUppercase.value ? chars.upper : '')
			+(checkedNumbers.value ? chars.numeric : '')
			+(checkedSymbols.value ? chars.symbols : '')
		).split('')
    ).join('').substring(0, charsLength.value);
	emit('updated', password.value)
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

onMounted(() => {
	generatePassword();
})

watch(() => password.value, (newValue) => {
	password.value = newValue
	checkStrength()
})

watch(() => checkedLowercase.value, (newValue) => {
	checkedLowercase.value = newValue
	generatePassword()
})

watch(() => checkedUppercase.value, (newValue) => {
	checkedUppercase.value = newValue
	generatePassword()
})

watch(() => checkedNumbers.value, (newValue) => {
	checkedNumbers.value = newValue
	generatePassword()
})

watch(() => checkedSymbols.value, (newValue) => {
	checkedSymbols.value = newValue
	generatePassword()
})
</script>
<template>
		
        <div class="relative mb-2">

			<q-input
					v-model="password"
					label="Password"
					:type="hidePasswordField? 'password' : 'text'"
					autocomplete="new-password"
					:name="field.key"
					:input-class="`JLInput JLInput${Strings.capitalize(field.field)} JLInput${Strings.capitalize(
						field.key,
					)} ${field.classes ?? ''}`"
					:dense="field.settings?.dense"
					:counter="field.settings?.counter"
					:hide-bottom-space="field.settings?.hideBottomSpace"
					:lazy-rules="field.settings?.lazy_rules"
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
				>
				<template v-slot:append>
					<q-icon
						:name="hidePasswordField ? 'visibility_off' : 'visibility'"
						class="cursor-pointer"
						@click="hidePasswordField = !hidePasswordField"
					/>
        </template>
			
			</q-input>
        </div>
        <div class="flex flex-row" v-if="!hidePasswordStrength">
            <div v-for="(v,i) in 5" :key="i" class="password-strength-col">
            	<div :class="i<passwordScore ? ( passwordScore <=2? 'bg-red' : (passwordScore <=4 ? 'bg-orange' : 'bg-green')) : 'bg-gray'"></div>
            </div>
        </div>
      
        <div class="mt-2 mb-2" v-if="!hidePasswordLength">
            <label class="block text-xs font-semibold text-gray-500 mb-2">PASSWORD LENGTH</label>

			<q-input
					v-model="charsLength"
					label="Password Length"
					type="number" min="8" max="30" step="1"
					:dense="field.settings?.dense"
					:counter="field.settings?.counter"
					:hide-bottom-space="field.settings?.hideBottomSpace"
					:lazy-rules="field.settings?.lazy_rules"
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
					@input="generatePassword()"
				>
			
			</q-input>
			<q-slider v-model="charsLength" :min="8" :max="30" color="primary"/>
        </div>

		<div class="flex" v-if="!hidePasswordOptions">
			<div class="flex password-options-checkbox" >
				<div class="flex flex-col pr-2 center">
					<q-checkbox v-model="checkedLowercase" color="primary" :disabled="forceCharLowercase"/>
					<span class="pt-1 text-xs text-gray-500">LOWERCASE</span>
				</div>
			</div>
			<div class="flex password-options-checkbox" >
				<div class="flex flex-col pl-2 pr-2 center">
					<q-checkbox v-model="checkedUppercase" color="primary" :disabled="forceCharUppercase"/>		
					<span class="pt-1 text-xs text-gray-500">UPPERCASE</span>
				</div>
				</div>
			<div class="flex password-options-checkbox" >
					<div class="flex flex-col pl-2 pr-2 center">
						<q-checkbox v-model="checkedNumbers" color="primary" :disabled="forceCharNumbers"/>		
						<span class="pt-1 text-xs text-gray-500">NUMBERS</span>
					</div>
			</div>
			<div class="flex password-options-checkbox" >
				<div class="flex flex-col pl-2 center">
					<q-checkbox v-model="checkedSymbols" color="primary" :disabled="forceCharSymbols"/>				
					<span class="pt-1 text-xs text-gray-500">SYMBOLS</span>
				</div>
			</div>
		</div>
  
</template>
<style scoped>
.password-strength-col {
	height: 8px;
	flex-basis: 20%;
	padding-left: 2px;
	padding-right: 2px;
}

.password-strength-col > div {
	height: 100%;
}

.password-options-checkbox {
	width: 25%;
}
</style>
