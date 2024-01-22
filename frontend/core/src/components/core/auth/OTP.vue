<script setup lang="ts">
import VOtpInput from 'vue3-otp-input'
import { Ref } from 'vue'

const emit = defineEmits(['complete'])
const props = defineProps<{
	code?: string
}>()

const handleOnComplete = (value: string) => {
	emit('complete', value)
}

</script>

<template>
	<div class="auth_otp_box" style="display: flex; flex-direction: row; justify-content: center">
		<v-otp-input
			:value="code"
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