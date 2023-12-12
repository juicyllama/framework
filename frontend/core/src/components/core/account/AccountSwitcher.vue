<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { UserStore } from '../../../store/user'
import { AccountStore } from '../../../store/account'
import { Account, FormViewSettings, FormViewDesignSettings } from '../../../types'
import { useRouter } from 'vue-router'

let accounts: Ref<Account[]> = ref([])
let options: { label: string; value: number }[]

const props = defineProps<{
	settings: FormViewSettings
}>()

const accountStore = AccountStore()
const userStore = UserStore()
const router = useRouter()

if (!userStore.user) {
	await userStore.logout(router)
}

userStore.$subscribe((mutation, state) => {
	accounts.value = state.user?.accounts
})

accounts.value = userStore.user?.accounts

let model = ref<{ label: string; value: number }>(
	accountStore.selected_account
		? {
				label: accountStore.selected_account?.account_name,
				value: accountStore.selected_account?.account_id,
		  }
		: {
				label: accounts.value[0].account_name,
				value: accounts.value[0].account_id,
		  },
)

options = userStore.user?.accounts?.map(account => {
	return {
		label: account.account_name,
		value: account.account_id,
	}
})

watch(model, value => {
	const account = accounts?.value?.find(account => {
		return account.account_id === value.value
	})
	const accountStore = AccountStore()
	accountStore.setSelectedAccount(account)
	window.history.go()
})
</script>

<template>
	<div class="JLAccountSwitcher" v-if="accounts && accounts.length > 1">
		<q-select {{props.form?.field?.settings?.design}}
			v-model="model"
			:dense="props.settings?.dense ?? false"
			:options="options"
			:outlined="props?.settings?.design === FormViewDesignSettings.OUTLINED"
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
			>
			<template v-slot:prepend v-if="props.settings?.icon?.name">
				<q-icon
					:name="props.settings.icon.name"
					:size="props.settings.icon.size ?? null"
					:color="props.settings.icon.color ?? null"
					:class="props.settings.icon.classes ?? null" />
			</template>
		</q-select>
	</div>
</template>
