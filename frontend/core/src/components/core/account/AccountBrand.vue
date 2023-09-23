<script setup lang="ts">
import { AccountStore } from '@/store/account.js'
import { UserStore } from '@/store/user.js'
import { ref } from 'vue'
import AccountAvatar from '@/components/core/account/AccountAvatar.vue'

const accounts = UserStore().user.accounts
const account_name = ref<string>(await AccountStore().getAccountName)
</script>

<template>
	<div class="JLAccountBrand flex q-pl-sm" v-if="accounts.length === 1">
		<q-item-section style="flex: 0 40px; font-size: medium">
			<AccountAvatar size="30px" />
		</q-item-section>
		<q-item-section>
			<q-item-label class="text-h6">
				{{ account_name }}
			</q-item-label>
		</q-item-section>
	</div>
</template>

<style></style>
