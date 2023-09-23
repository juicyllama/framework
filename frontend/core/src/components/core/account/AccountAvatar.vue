<script setup lang="ts">
import { ref } from 'vue'
import { logger } from '@/helpers/logger.js'
import { LogSeverity } from '@/types/common.js'
import { getCssVar, useQuasar } from 'quasar'
import { AccountStore } from '@/store/account.js'
import { Account } from '@/types/account.js'
import { Color } from '@juicyllama/utils'

const $q = useQuasar()
const accountStore = AccountStore()

const editAvatar = ref<boolean>(false)

const props = defineProps<{
	size?: string
	clickToEdit?: boolean
}>()

function short(string: string) {
	return string
		.split(/\s/)
		.reduce((response, word) => (response += word.slice(0, 1)), '')
		.toUpperCase()
}

function toggleEditAvatar() {
	editAvatar.value = !editAvatar.value
}

function onRejected() {
	logger({
		severity: LogSeverity.ERROR,
		message: `The upload did not pass validation constraints, must be an image`,
		q: $q,
	})
}

async function uploadAvatar(files): Promise<Account> {
	return await accountStore.updateAvatar(files[0], $q)
}

function stripPx(s: string): string {
	return s.replace('px', '')
}

function getTextColor(): string {
	return Color.lightOrDark(getCssVar('secondary')) === 'light' ? 'black' : 'white'
}
</script>

<template>
	<div id="AccountAvatar">
		<q-avatar
			:size="props.size"
			:color="accountStore?.selected_account?.avatar_image_url ? '' : 'secondary'"
			:text-color="getTextColor()"
			@click="props.clickToEdit ? toggleEditAvatar() : null">
			<q-tooltip v-if="props.clickToEdit" class="bg-primary" anchor="center middle"> Edit Avatar </q-tooltip>

			<span v-if="accountStore?.selected_account?.avatar_image_url">
				<img
					:src="accountStore?.selected_account?.avatar_image_url"
					:width="stripPx(props.size)"
					:height="stripPx(props.size)"
					:style="`width: ${props.size}; height: ${props.size};`" />
			</span>
			<span v-else>{{ short(accountStore?.selected_account?.account_name) }}</span>
		</q-avatar>

		<q-dialog v-model="editAvatar">
			<q-card style="width: 500px; max-width: 80vw">
				<q-card-section>
					<div class="text-h6">Edit Avatar</div>
				</q-card-section>
				<q-card-section class="flex q-ml-md">
					<q-uploader
						@added="uploadAvatar"
						multiple
						accept=".jpg, image/*"
						@rejected="onRejected()"
						:auto-upload="true"
						:hide-upload-btn="true">
					</q-uploader>
				</q-card-section>
			</q-card>
		</q-dialog>
	</div>
</template>

<style scoped></style>
