<script setup lang="ts">
import VOtpInput from 'vue3-otp-input'

const emit = defineEmits(['complete'])

defineProps<{
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
<style>
.otp-input {
    width: 40px;
    border: 1px solid #eee;
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    font-size: 20px;
}
div[is-input-num='true'] {
    width: 100%;
    justify-content: space-between;
}
.auth_otp_box {
	width: 100%;
}
</style>
