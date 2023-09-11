<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserStore } from '../../../store/user'
import AuthActions from '@/components/core/auth/Actions.vue'
import OTP from '@/components/core/auth/OTP.vue'
import { useRouter } from 'vue-router'
import type { AuthFormState } from '../../../helpers/validators'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const userStore = UserStore()

const state = reactive(<AuthFormState>{
	email: '',
	stage: 0,
})

const loading = ref(false)

const router = useRouter()

const validateEmail = (email: string): boolean => {
	return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)
}

async function login(state: AuthFormState) {
	loading.value = true
	const result = await userStore.passwordlss(state.email.trim())
	if (result) {
		state.stage = 1
	}
	loading.value = false
}

async function processCode(code) {
	const user = await userStore.passwordlssCode(state.email.trim(), code, $q)
	if (user?.user_id) {
		await router.push('/dashboard')
	}
}
</script>

<template>
	<q-form autofocus @submit="login(state)" v-if="state.stage === 0">
		<slot name="header">
			<q-card-section>
				<div class="text-h6">Passwordless Login</div>
			</q-card-section>
			<q-separator inset />
		</slot>
		<q-card-section class="column q-gutter-md">
			<q-input
				name="email"
				label="Email *"
				v-model="state.email"
				:rules="[val => validateEmail(val) || 'Must be a valid email.']"
				autocomplete></q-input>
		</q-card-section>
		<slot name="actions" :loading="loading">
			<AuthActions submit_label="Send Code" :loading="loading"></AuthActions>
		</slot>
	</q-form>

	<q-form autofocus v-else-if="state.stage === 1">
		<slot name="header">
			<q-card-section>
				<div class="text-h6">Passwordless Login</div>
			</q-card-section>
			<q-separator inset />
		</slot>
		<q-card-section class="column q-mt-md">
			<OTP @complete="processCode"></OTP>
		</q-card-section>

		<slot name="actions" :loading="loading">
			<q-card-section class="text-center q-pa-sm auth_action_link">
				<router-link to="#" @click="state.stage = 0"><p class="text-grey-6 q-mr-xs">Back</p></router-link>
			</q-card-section>
		</slot>
	</q-form>
</template>

<style scoped></style>
