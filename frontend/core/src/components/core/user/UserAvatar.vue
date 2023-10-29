<script setup lang="ts">
import { ref } from 'vue'
import UserMenu from './UserMenu.vue'
import { UserStore } from '../../../store/user'
import { User, AvatarType, UserAvatarOptions } from '../../../types'
import { gravatar } from '../../../plugins/gravatar'
import { logger } from '../../../helpers'
import { Strings } from '@juicyllama/vue-utils'
import { LogSeverity } from '../../../types'
import { useQuasar } from 'quasar'
import { stripPx, short } from '../../../helpers'

const userStore = UserStore()
const $q = useQuasar()

const props = defineProps<UserAvatarOptions>()

const editAvatar = ref<boolean>(false)
const tab = ref<AvatarType>(userStore?.user?.avatar_type)

if (!tab.value || tab.value === AvatarType.NONE) {
	tab.value = AvatarType.IMAGE
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

async function uploadAvatar(files): Promise<User> {
	return await userStore.updateOwnAvatar(files[0], $q)
}

async function selectCartoon(letter: string): Promise<User> {
	return await userStore.updateOwnProfile(
		{
			avatar_type: AvatarType.CARTOON,
			avatar_image_url: letter,
		},
		$q,
	)
}

async function selectGravatar(): Promise<User> {
	return await userStore.updateOwnProfile(
		{
			avatar_type: AvatarType.GRAVATAR,
			avatar_image_url: null,
		},
		$q,
	)
}
</script>

<template>
	<div id="UserAvatarContainer">
		<q-avatar
			class="UserAvatar"
			:size="props.avatar?.size ?? '24px'"
			:color="
				[AvatarType.IMAGE, AvatarType.GRAVATAR].includes(userStore?.user?.avatar_type)
					? ''
					: props.avatar?.background_color ?? 'secondary'
			"
			:style="props.clickToMenu || props.clickToEdit ? 'cursor: pointer' : ''"
			@click="props.clickToEdit ? toggleEditAvatar() : null">
			<q-tooltip v-if="props.clickToEdit" class="UserAvatarTooltip bg-primary" anchor="center middle">
				Edit Avatar
			</q-tooltip>

			<span v-if="userStore?.user?.avatar_type === AvatarType.IMAGE">
				<img
					alt="UserAvatar"
					class="UserAvatarImage"
					:src="userStore.user.avatar_image_url"
					:width="stripPx(props.avatar?.size ?? '24px')"
					:height="stripPx(props.avatar?.size ?? '24px')"
					:style="`width: ${props.avatar?.size ?? '24px'}; height: ${props.avatar?.size ?? '24px'};`" />
			</span>
			<span v-else-if="userStore?.user?.avatar_type === AvatarType.CARTOON">
				<img
					alt="Cartoon"
					class="UserAvatarImage"
					:src="`/images/avatars/${userStore?.user?.avatar_image_url.toLowerCase()}.png`"
					:width="stripPx(props.avatar?.size ?? '24px')"
					:height="stripPx(props.avatar?.size ?? '24px')"
					:style="`width: ${props.avatar?.size ?? '24px'}; height: ${props.avatar?.size ?? '24px'};`" />
			</span>
			<span v-else-if="userStore?.user?.avatar_type === AvatarType.GRAVATAR">
				<img
					alt="Gravatar"
					class="UserAvatarImage"
					:src="gravatar(userStore.user.email, stripPx(props.avatar?.size ?? '24px'))"
					:width="stripPx(props.avatar?.size ?? '24px')"
					:height="stripPx(props.avatar?.size ?? '24px')"
					:style="`width: ${props.avatar?.size ?? '24px'}; height: ${props.avatar?.size ?? '24px'};`" />
			</span>
			<span
				v-else
				class="UserAvatarText"
				:style="props.avatar.text_color ? `color: ${props.avatar.text_color}` : null"
				>{{ short(userStore?.user?.first_name) }}{{ short(userStore?.user?.last_name) }}</span
			>

			<UserMenu
				v-if="props.clickToMenu"
				:avatar="props.menu.avatar"
				:icon="props.menu.icon"
				:show="props.menu.show" />
		</q-avatar>

		<q-dialog v-model="editAvatar">
			<q-card style="width: 500px; max-width: 80vw">
				<q-card-section>
					<div class="text-h6">Edit Avatar</div>
				</q-card-section>

				<q-tab-panels v-model="tab" animated class="q-pb-lg">
					<q-tab-panel :name="AvatarType.IMAGE">
						<q-uploader
							@added="uploadAvatar"
							multiple
							accept=".jpg, image/*"
							@rejected="onRejected()"
							:auto-upload="true"
							:hide-upload-btn="true">
							<!--							<template v-slot:header="scope">
								<div class="row no-wrap items-center q-pa-sm q-gutter-xs">
									<q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
									<div class="col">
										<div class="q-uploader__title">Upload Avatar</div>
									</div>
									<q-btn
										v-if="scope.canAddFiles"
										type="a"
										icon="open_in_browser"
										@click="scope.pickFiles"
										round
										dense
										flat
									>
										<q-uploader-add-trigger />
										<q-tooltip>Pick Files</q-tooltip>
									</q-btn>
								</div>
							</template>-->
						</q-uploader>
					</q-tab-panel>

					<q-tab-panel :name="AvatarType.CARTOON">
						<p>Select a cartoon avatar:</p>
						<q-avatar v-for="n in 25" :key="n" square class="q-ma-sm" style="cursor: pointer">
							<img
								:src="`/images/avatars/${Strings.numbersTo26Letters(n - 1).toLowerCase()}.png`"
								:width="50"
								:height="50"
								style="width: 50px; height: 50px"
								@click="selectCartoon(Strings.numbersTo26Letters(n - 1))" />
						</q-avatar>
					</q-tab-panel>

					<q-tab-panel :name="AvatarType.GRAVATAR">
						<p>Use gravatar to load your avatar:</p>
						<q-btn
							color="primary"
							@click="selectGravatar"
							:disabled="userStore?.user?.avatar_type === AvatarType.GRAVATAR">
							Switch to Gravatar
						</q-btn>
					</q-tab-panel>
				</q-tab-panels>

				<q-separator />

				<q-tabs v-model="tab" dense align="justify" narrow-indicator>
					<q-tab :name="AvatarType.IMAGE" label="Upload" />
					<q-tab :name="AvatarType.CARTOON" label="Cartoon" />
					<q-tab :name="AvatarType.GRAVATAR" label="Gravatar" />
				</q-tabs>
			</q-card>
		</q-dialog>
	</div>
</template>

<style scoped></style>
