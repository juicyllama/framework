<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { UserStore } from '@/store/user'
import { AccountStore } from '@/store/account'
import type { Account, FormSettings } from '@/types'

let accounts: Ref<Account[]> = ref([])
let options: { label: string; value: number }[]

const props = defineProps<{
	form?: FormSettings
}>()

const accountStore = AccountStore()
const userStore = UserStore()

userStore.$subscribe((mutation, state) => {
	accounts.value = state.user.accounts
})

if (!userStore.user) {
	await userStore.logout()
}

accounts.value = userStore.user.accounts

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

options = userStore.user.accounts.map(account => {
	return {
		label: account.account_name,
		value: account.account_id,
	}
})

watch(model, value => {
	const account = accounts.value.find(account => {
		return account.account_id === value.value
	})
	const accountStore = AccountStore()
	accountStore.setSelectedAccount(account)
	window.history.go()
})
</script>

<template>
	<div class="JLAccountSwitcher" v-if="accounts.length > 1">
		<q-select
			v-model="model"
			:outlined="props.form?.field?.settings?.outlined ?? false"
			:dense="props.form?.field?.settings?.dense ?? false"
			:filled="props.form?.field?.settings?.filled ?? false"
			:options="options">
			<template v-slot:prepend v-if="props.form?.field?.settings?.icon?.name">
				<q-icon
					:name="props.form.field.settings.icon.name"
					:size="props.form.field.settings.icon.size ?? null"
					:color="props.form.field.settings.icon.color ?? null"
					:class="props.form.field.settings.icon.classes ?? null" />
			</template>
		</q-select>
	</div>
</template>
