<script setup lang="ts">
import { reactive, ref } from 'vue'
import { validateEmail, isPasswordValid, type ValidationPassword } from '@/helpers/validators.js'
import PasswordCriteria from './PasswordCriteria.vue'
import AuthActions from '@/components/core/auth/Actions.vue'
import type { CreateAccount } from '@/types/account.js'
import { AccountStore } from '@/store/account.js'
import { useRouter } from 'vue-router'

const props = defineProps<{
	dense?: boolean
	skip_account_name?: boolean
	success_redirect?: string
	lazy_rules?: boolean
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
				:dense="props?.dense ?? false"
				name="account-name"
				label="Account Name"
				v-model="state.account_name"
				:rules="[val => (val && val.length > 0) || 'Account name must be filled in.']"
				:lazy-rules="props?.lazy_rules ?? false"></q-input>
			<q-input
				autocomplete="given-name"
				name="given-name"
				:dense="props?.dense ?? false"
				label="First Name *"
				v-model="state.first_name"
				:rules="[val => (val && val.length > 0) || 'First name must be filled in.']"
				:lazy-rules="props?.lazy_rules ?? false"></q-input>
			<q-input
				:dense="props?.dense ?? false"
				autocomplete="family-name"
				name="family-name"
				label="Last Name *"
				v-model="state.last_name"
				:rules="[val => (val && val.length > 0) || 'Last name must be filled in.']"
				:lazy-rules="props?.lazy_rules ?? false"></q-input>
			<q-input
				:dense="props?.dense ?? false"
				autocomplete="email"
				id="email"
				name="email"
				label="Email *"
				v-model="state.email"
				:rules="[val => validateEmail(val) || 'Must be a valid email.']"
				:lazy-rules="props?.lazy_rules ?? false"></q-input>
			<PasswordCriteria :authFormState="state" :lazy-rules="props?.lazy_rules ?? false"></PasswordCriteria>
			<q-input
				autocomplete="new-password"
				id="password"
				name="password"
				:dense="props?.dense ?? false"
				label="Password *"
				v-model="state.password.value"
				type="password"
				:rules="[() => isPasswordValid(state.password) || 'Password must meet all criteria.']"
				:lazy-rules="props?.lazy_rules ?? false">
			</q-input>
			<q-input
				autocomplete="new-password"
				id="confirm-password"
				name="confirm-password"
				:dense="props?.dense ?? false"
				label="Confirm Password *"
				v-model="state.password.confirm"
				:disable="!isPasswordValid(state.password)"
				type="password"
				:rules="[val => (val && val === state.password.value) || 'Must match password.']"
				:lazy-rules="props?.lazy_rules ?? false">
			</q-input>
		</q-card-section>
		<slot name="actions" :loading="loading">
			<AuthActions submit_label="Create Account" :loading="loading"></AuthActions>
		</slot>
	</q-form>
</template>

<style scoped></style>
