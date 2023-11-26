<script setup lang="ts">
import { AuthFormState, isPasswordValid } from '../../../helpers/validators'

const props = defineProps<{
	show?: boolean
	lazyRules?: boolean | 'ondemand'
	authFormState: AuthFormState
}>()
</script>

<template v-if="!props.lazyRules || (props.lazyRules && props.show)">
	<div class="passwordVerification q-pa-sm" v-if="!isPasswordValid(props.authFormState.password)">
		<div class="text-subtitle2 q-mb-sm">Password Criteria:</div>
		<div>
			<q-icon
				:name="
					props.authFormState.password.valid.lengthOk
						? 'check_circle'
						: 'cancel'
				"
				:color="props.authFormState.password.valid.lengthOk ? 'positive' : 'negative'"></q-icon>
			Must be at least 12 characters long.
		</div>
		<div>
			<q-icon
				:name="
					props.authFormState.password.valid.capital
						? 'check_circle'
						: 'cancel'
				"
				:color="props.authFormState.password.valid.capital ? 'positive' : 'negative'"></q-icon>
			Must contain at least one capital letter.
		</div>
		<div>
			<q-icon
				:name="
					props.authFormState.password.valid.number
						? 'check_circle'
						: 'cancel'
				"
				:color="props.authFormState.password.valid.number ? 'positive' : 'negative'"></q-icon>
			Must contain at least one number.
		</div>
		<div>
			<q-icon
				:name="
					props.authFormState.password.valid.symbol
						? 'check_circle'
						: 'cancel'
				"
				:color="props.authFormState.password.valid.symbol ? 'positive' : 'negative'"></q-icon>
			Must contain at least one special character: !@#$%^&*()-_+=
		</div>
	</div>
</template>

<style scoped></style>
