<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'
import { UserStore } from '@/store/user'
import { JLMenu } from '../../common/menu'
import { Menu, UserMenuOptions } from '@/types'
import { ref } from 'vue'

const userStore = UserStore()
const admin = ref<boolean>(await userStore.isAdmin())

const props = defineProps<UserMenuOptions>()

let userMenu: Menu = {
	items: [],
}

if (props?.show?.profile) {
	userMenu.items.push({
		title: 'Your Profile',
		caption: '',
		icon: `${props.icon?.type ? props.icon.type : 'fa-duotone'} fa-user`,
		link: '/profile',
	})
}

if (props?.show?.billing) {
	userMenu.items.push({
		title: 'Billing',
		caption: '',
		icon: `${props.icon?.type ? props.icon.type : 'fa-duotone'} fa-file-invoice`,
		link: '/invoices',
	})
}

if (admin.value && props?.show?.admin) {
	userMenu.items.push({
		title: 'Admin',
		caption: '',
		icon: `${props.icon?.type ? props.icon.type : 'fa-duotone'} fa-cog`,
		link: '/admin',
	})
}

function logout() {
	userStore.logout()
}
</script>

<template>
	<q-menu class="JLUserMenu">
		<div class="row no-wrap q-pa-md Header">
			<div class="column q-pr-lg">
				<UserAvatar :click-to-edit="true" :avatar="props.avatar" />
			</div>
			<div class="column">
				<div class="JLUserMenuName text-subtitle1 q-mt-xs">
					{{ userStore?.user?.first_name }} {{ userStore?.user?.last_name }}
				</div>
				<div class="JLUserMenuEmail text-caption">{{ userStore?.user?.email }}</div>
			</div>
		</div>

		<div class="q-pa-md">
			<JLMenu :menu="userMenu" class="q-mb-xs" />

			<q-separator />

			<q-card-actions align="left" class="q-pt-md">
				<q-btn color="primary" label="Logout" size="sm" @click="logout" />
			</q-card-actions>
		</div>
	</q-menu>
</template>

<style scoped></style>
