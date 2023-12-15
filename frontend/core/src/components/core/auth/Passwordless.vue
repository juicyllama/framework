<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserStore } from '../../../store/user'
import AuthActions from '../../../components/core/auth/Actions.vue'
import OTP from '../../../components/core/auth/OTP.vue'
import { useRouter } from 'vue-router'
import type { AuthFormState } from '../../../helpers/validators'
import { useQuasar } from 'quasar'
import { FormViewSettings, FormViewDesignSettings } from '../../../types'

const $q = useQuasar()
const userStore = UserStore()

const props = defineProps<{
	settings?: FormViewSettings
}>()

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
				v-model="state.email"
				:rules="[val => validateEmail(val) || 'Must be a valid email.']"
				autocomplete
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
