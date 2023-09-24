<script setup lang="ts">
import { ref } from 'vue'
import { Strings } from '@juicyllama/vue-utils'
import { useQuasar } from 'quasar'
import { AvatarType, Contact, LogSeverity } from '@/types'
import { logger } from '@/helpers'
import { CONTACTS_ENDPOINT, ContactsService } from '@/services/crm/contacts'
import { stripPx, short } from '@/helpers'
import { gravatar } from '@/plugins/gravatar'

const props = defineProps<{
	contact: Contact
	size?: string
	clickToEdit?: boolean
	icon_type?: string
	avatar_background_color?: string
	avatar_text_color?: string
	fallback_image?: string
}>()

const $q = useQuasar()
const editAvatar = ref<boolean>(false)
const tab = ref<AvatarType>(props.contact?.avatar_type)
const contactsService = new ContactsService()

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

async function uploadAvatar(files): Promise<Contact> {
	return await contactsService.updateContactAvatar(props.contact.contact_id, files[0])
}

async function selectCartoon(letter: string): Promise<Contact> {
	return await contactsService.update({
		record_id: props.contact.contact_id,
		url: `${CONTACTS_ENDPOINT}/${props.contact.contact_id}`,
		data: {
			avatar_type: AvatarType.CARTOON,
			avatar_image_url: letter,
		},
		q: $q,
	})
}

async function selectGravatar(): Promise<Contact> {
	return await contactsService.update({
		record_id: props.contact.contact_id,
		url: `${CONTACTS_ENDPOINT}/${props.contact.contact_id}`,
		data: {
			avatar_type: AvatarType.GRAVATAR,
			avatar_image_url: null,
		},
		q: $q,
	})
}
</script>

<template>
	<div id="ContactAvatarContainer">
		<q-avatar
			class="ContactAvatar"
			:size="props.size"
			:color="
				[AvatarType.IMAGE, AvatarType.GRAVATAR].includes(props.contact.avatar_type)
					? ''
					: props.avatar_background_color ?? 'secondary'
			"
			:style="props.clickToEdit ? 'cursor: pointer' : ''"
			@click="props.clickToEdit ? toggleEditAvatar() : null">
			<q-tooltip v-if="props.clickToEdit" class="ContactAvatarTooltip bg-primary" anchor="center middle">
				Edit Avatar
			</q-tooltip>

			<span v-if="props.contact.avatar_type === AvatarType.IMAGE">
				<img
					alt="ContactAvatar"
					class="ContactAvatarImage"
					:src="props.contact.avatar_image_url"
					:width="stripPx(props.size)"
					:height="stripPx(props.size)"
					:style="`width: ${props.size}; height: ${props.size};`" />
			</span>
			<span v-else-if="props.contact.avatar_type === AvatarType.CARTOON">
				<img
					alt="Cartoon"
					class="ContactAvatarImage"
					:src="`/images/avatars/${props.contact.avatar_image_url.toLowerCase()}.png`"
					:width="stripPx(props.size)"
					:height="stripPx(props.size)"
					:style="`width: ${props.size}; height: ${props.size};`" />
			</span>
			<span v-else-if="props.contact.avatar_type === AvatarType.GRAVATAR">
				<img
					alt="Gravatar"
					class="ContactAvatarImage"
					:src="gravatar(props.contact.emails[0].email, stripPx(props.size))"
					:width="stripPx(props.size)"
					:height="stripPx(props.size)"
					:style="`width: ${props.size}; height: ${props.size};`" />
			</span>
			<span
				v-else-if="props.contact.first_name || props.contact.last_name"
				class="ContactAvatarText"
				:style="props.avatar_text_color ? `color: ${props.avatar_text_color}` : null"
				>{{ short(props.contact.first_name) }}{{ short(props.contact.last_name) }}
			</span>
			<span v-else>
				<img
					alt="DefaultContactAvatar"
					class="DefaultContactAvatarImage"
					:src="props.fallback_image ?? '/icon.png'"
					:width="stripPx(props.size)"
					:height="stripPx(props.size)"
					:style="`width: ${props.size}; height: ${props.size};`" />
			</span>
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
										icon="fa-duotone fa-folder-arrow-up"
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
							:disabled="props.contact.avatar_type === AvatarType.GRAVATAR">
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
