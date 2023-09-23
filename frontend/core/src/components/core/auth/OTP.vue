<script lang="ts">
import VOtpInput from 'vue3-otp-input'
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'OTP',
	components: {
		VOtpInput,
	},
	emits: ['complete'],
	setup(props, { emit }) {
		const otpInput = ref(null)

		const handleOnComplete = (value: string) => {
			emit('complete', value)
		}

		return { handleOnComplete, otpInput, emit, props }
	},
})
</script>

<template>
	<div class="auth_otp_box" style="display: flex; flex-direction: row; justify-content: center">
		<v-otp-input
			ref="otpInput"
			input-classes="otp-input"
			separator=""
			:num-inputs="6"
			:should-auto-focus="true"
			:is-input-num="true"
			:conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
			:placeholder="['*', '*', '*', '*', '*', '*']"
			@on-complete="handleOnComplete" />
	</div>
</template>

<style></style>
