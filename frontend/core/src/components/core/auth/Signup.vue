<script setup lang="ts">
import { reactive, ref } from 'vue'
import { validateEmail, isPasswordValid, type ValidationPassword } from '../../../helpers/validators'
import PasswordCriteria from './PasswordCriteria.vue'
import AuthActions from '../../../components/core/auth/Actions.vue'
import type { CreateAccount } from '../../../types/account'
import { AccountStore } from '../../../store/account'
import { useRouter } from 'vue-router'
import { FormViewSettings, FormViewDesignSettings } from '../../../types'

const props = defineProps<{
	skip_account_name?: boolean
	success_redirect?: string
	settings?: FormViewSettings
}>()

const state = reactive(<CreateAccount>{
	account_name: '',
	first_name: '',
	last_name: '',
	email: '',
	password: <ValidationPassword>{
		value: '',
		confirm: '',
		valid: {
			length: false,
			capital: false,
			number: false,
			symbol: false,
		},
		validated: false,
	},
})

const accountStore = AccountStore()
const loading = ref(false)
const router = useRouter()

async function create(state: CreateAccount) {
	loading.value = true

	if (props.skip_account_name) {
		state.account_name = `${state.first_name} ${state.last_name} project`
	}

	const user = await accountStore.create(state)
	if (user?.user_id) {
		await router.push(props.success_redirect ?? '/dashboard')
	}
	loading.value = false
}
</script>

<template>
	<q-form autofocus @submit="create(state)">
		<slot name="header">
			<q-card-section>
				<div class="text-h6">Create New Account</div>
				<div class="text-accent">Fill out the following form to create your new account.</div>
			</q-card-section>
			<q-separator inset />
		</slot>
		<q-card-section class="column auth-field-container">
			<q-input
				v-if="!props.skip_account_name"
				name="account-name"
				v-model="state.account_name"
				:rules="[val => (val && val.length > 0) || 'Account name must be filled in.']"
				:label="!props.settings?.stack_label ? 'Account Name' : null"
				:dense="props.settings?.dense"
				:counter="props.settings?.counter"
				:hide-bottom-space="props.settings?.hideBottomSpace"
				:lazy-rules="props.settings?.lazy_rules"
				:outlined="props.settings?.design === FormViewDesignSettings.OUTLINED"
				:filled="props.settings?.design === FormViewDesignSettings.FILLED"
				:standout="props.settings?.design === FormViewDesignSettings.STANDOUT"
				:borderless="props.settings?.design === FormViewDesignSettings.BORDERLESS"
				:rounded="props.settings?.design === FormViewDesignSettings.ROUNDED"
				:rounded-filled="props.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
				:rounded-outlined="props.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
				:rounded-standout="props.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
				:square="props.settings?.design === FormViewDesignSettings.SQUARE"
				:square-filled="props.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
				:square-outlined="props.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
				:square-standout="props.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
				:no-error-icon="props.settings?.no_error_icon"
				></q-input>
			<q-input
				autocomplete="given-name"
				name="given-name"
				v-model="state.first_name"
				:rules="[val => (val && val.length > 0) || 'First name must be filled in.']"
				:label="!props.settings?.stack_label ? 'First Name *' : null"
				:dense="props.settings?.dense"
				:counter="props.settings?.counter"
				:hide-bottom-space="props.settings?.hideBottomSpace"
				:lazy-rules="props.settings?.lazy_rules"
				:outlined="props.settings?.design === FormViewDesignSettings.OUTLINED"
				:filled="props.settings?.design === FormViewDesignSettings.FILLED"
				:standout="props.settings?.design === FormViewDesignSettings.STANDOUT"
				:borderless="props.settings?.design === FormViewDesignSettings.BORDERLESS"
				:rounded="props.settings?.design === FormViewDesignSettings.ROUNDED"
				:rounded-filled="props.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
				:rounded-outlined="props.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
				:rounded-standout="props.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
				:square="props.settings?.design === FormViewDesignSettings.SQUARE"
				:square-filled="props.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
				:square-outlined="props.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
				:square-standout="props.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
				:no-error-icon="props.settings?.no_error_icon"
				></q-input>
			<q-input
				autocomplete="family-name"
				name="family-name"
				v-model="state.last_name"
				:rules="[val => (val && val.length > 0) || 'Last name must be filled in.']"
				:label="!props.settings?.stack_label ? 'Last Name *' : null"
				:dense="props.settings?.dense"
				:counter="props.settings?.counter"
				:hide-bottom-space="props.settings?.hideBottomSpace"
				:lazy-rules="props.settings?.lazy_rules"
				:outlined="props.settings?.design === FormViewDesignSettings.OUTLINED"
				:filled="props.settings?.design === FormViewDesignSettings.FILLED"
				:standout="props.settings?.design === FormViewDesignSettings.STANDOUT"
				:borderless="props.settings?.design === FormViewDesignSettings.BORDERLESS"
				:rounded="props.settings?.design === FormViewDesignSettings.ROUNDED"
				:rounded-filled="props.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
				:rounded-outlined="props.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
				:rounded-standout="props.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
				:square="props.settings?.design === FormViewDesignSettings.SQUARE"
				:square-filled="props.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
				:square-outlined="props.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
				:square-standout="props.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
				:no-error-icon="props.settings?.no_error_icon"
				></q-input>
			<q-input
				autocomplete="email"
				id="email"
				name="email"
				v-model="state.email"
				:rules="[val => validateEmail(val) || 'Must be a valid email.']"
				:label="!props.settings?.stack_label ? 'Email Address *' : null"
				:dense="props.settings?.dense"
				:counter="props.settings?.counter"
				:hide-bottom-space="props.settings?.hideBottomSpace"
				:lazy-rules="props.settings?.lazy_rules"
				:outlined="props.settings?.design === FormViewDesignSettings.OUTLINED"
				:filled="props.settings?.design === FormViewDesignSettings.FILLED"
				:standout="props.settings?.design === FormViewDesignSettings.STANDOUT"
				:borderless="props.settings?.design === FormViewDesignSettings.BORDERLESS"
				:rounded="props.settings?.design === FormViewDesignSettings.ROUNDED"
				:rounded-filled="props.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
				:rounded-outlined="props.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
				:rounded-standout="props.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
				:square="props.settings?.design === FormViewDesignSettings.SQUARE"
				:square-filled="props.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
				:square-outlined="props.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
				:square-standout="props.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
				:no-error-icon="props.settings?.no_error_icon"
				></q-input>
			<PasswordCriteria :authFormState="state" :lazy-rules="props?.settings?.lazy_rules ?? false"></PasswordCriteria>
			<q-input
				autocomplete="new-password"
				id="password"
				name="password"
				v-model="state.password.value"
				type="password"
				:rules="[val => isPasswordValid(state.password) || 'Password must meet all criteria.']"
				:label="!props.settings?.stack_label ? 'Password *' : null"
				:dense="props.settings?.dense"
				:counter="props.settings?.counter"
				:hide-bottom-space="props.settings?.hideBottomSpace"
				:lazy-rules="props.settings?.lazy_rules"
				:outlined="props.settings?.design === FormViewDesignSettings.OUTLINED"
				:filled="props.settings?.design === FormViewDesignSettings.FILLED"
				:standout="props.settings?.design === FormViewDesignSettings.STANDOUT"
				:borderless="props.settings?.design === FormViewDesignSettings.BORDERLESS"
				:rounded="props.settings?.design === FormViewDesignSettings.ROUNDED"
				:rounded-filled="props.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
				:rounded-outlined="props.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
				:rounded-standout="props.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
				:square="props.settings?.design === FormViewDesignSettings.SQUARE"
				:square-filled="props.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
				:square-outlined="props.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
				:square-standout="props.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
				:no-error-icon="props.settings?.no_error_icon"
				>
			</q-input>
			<q-input
				autocomplete="new-password"
				id="confirm-password"
				name="confirm-password"
				v-model="state.password.confirm"
				:disable="!isPasswordValid(state.password)"
				type="password"
				:rules="[val => (val && val === state.password.value) || 'Must match password.']"
				:label="!props.settings?.stack_label ? 'Confirm Password *' : null"
				:dense="props.settings?.dense"
				:counter="props.settings?.counter"
				:hide-bottom-space="props.settings?.hideBottomSpace"
				:lazy-rules="props.settings?.lazy_rules"
				:outlined="props.settings?.design === FormViewDesignSettings.OUTLINED"
				:filled="props.settings?.design === FormViewDesignSettings.FILLED"
				:standout="props.settings?.design === FormViewDesignSettings.STANDOUT"
				:borderless="props.settings?.design === FormViewDesignSettings.BORDERLESS"
				:rounded="props.settings?.design === FormViewDesignSettings.ROUNDED"
				:rounded-filled="props.settings?.design === FormViewDesignSettings.ROUNDED_FILLED"
				:rounded-outlined="props.settings?.design === FormViewDesignSettings.ROUNDED_OUTLINED"
				:rounded-standout="props.settings?.design === FormViewDesignSettings.ROUNDED_STANDOUT"
				:square="props.settings?.design === FormViewDesignSettings.SQUARE"
				:square-filled="props.settings?.design === FormViewDesignSettings.SQUARE_FILLED"
				:square-outlined="props.settings?.design === FormViewDesignSettings.SQUARE_OUTLINED"
				:square-standout="props.settings?.design === FormViewDesignSettings.SQUARE_STANDOUT"
				:no-error-icon="props.settings?.no_error_icon"
				>
			</q-input>
		</q-card-section>
		<slot name="actions" :loading="loading">
			<AuthActions submit_label="Create Account" :loading="loading"></AuthActions>
		</slot>
	</q-form>
</template>

<style scoped></style>
