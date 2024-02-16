<script setup lang="ts">
import { AvatarType, Avatar } from '../../types'
import { stripPx } from '../../helpers'
const props = defineProps<Avatar>()
</script>

<template>
	<div id="UserAvatarContainer">
		<q-avatar
			class="UserAvatar"
			:size="props.options?.size ?? '24px'"
			:color="
				[AvatarType.IMAGE, AvatarType.GRAVATAR].includes(props.type)
					? ''
					: props.options?.background_color ?? 'secondary'
			"
			>

			<span v-if="props.type === AvatarType.IMAGE">
				<img
					alt="Avatar"
					class="AvatarImage"
					:src="props.image_url"
					:width="stripPx(props.options?.size ?? '24px')"
					:height="stripPx(props.options?.size ?? '24px')"
					:style="`width: ${props.options?.size ?? '24px'}; height: ${props.options?.size ?? '24px'};`" />
			</span>
			<span v-else-if="props.type === AvatarType.CARTOON">
				<img
					alt="Cartoon"
					class="UserAvatarImage"
					:src="`/images/avatars/${props.image_url.toLowerCase()}.png`"
					:width="stripPx(props.options?.size ?? '24px')"
					:height="stripPx(props.options?.size ?? '24px')"
					:style="`width: ${props.options?.size ?? '24px'}; height: ${props.options?.size ?? '24px'};`" />
			</span>
			<span
				v-else
				class="UserAvatarText"
				:style="props.options.text_color ? `color: ${props.options.text_color}` : null"
				>{{ props.name.substring(0,2) }}</span
			>

		</q-avatar>

	</div>
</template>

<style scoped></style>
