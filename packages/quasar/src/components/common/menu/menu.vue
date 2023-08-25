<script setup lang="ts">
import { computed } from 'vue'
import MenuItem from './components/menu-item.vue'
import { useRoute } from 'vue-router'
import { Menu } from '@/types/common'

const props = defineProps<{
	menu: Menu
}>()

const route = useRoute()
const path = computed(() => route.path)
</script>
<template>
	<div class="JLMenu">
		<q-list>
			<div v-for="(item, index) in props.menu.items" :key="index" class="JLMenuItem">
				<div v-if="!item.links?.length" class="JLMenuSingle">
					<q-item
						:clickable="!item.clickable_disabled"
						:disable="item.disable"
						tag="a"
						:to="!item.clickable_disabled ? item.link : null"
						:active="item.link === path.valueOf()">
						<MenuItem
							:title="item.title"
							:icon="item.icon"
							:caption="item.caption"
							:link="item.link"
							:border_color="item.border_color" />
					</q-item>
				</div>
				<div v-else class="JLMenuMultiple">
					<q-expansion-item
						:default-closed="props.menu.expand?.default_closed ? props.menu.expand.default_closed : null"
						:hide-expand-icon="
							props.menu.expand?.hide_expand_icon ? props.menu.expand.hide_expand_icon : null
						">
						<template v-slot:header>
							<MenuItem
								:title="item.title"
								:icon="item.icon"
								:caption="item.caption"
								:link="item.link"
								:border_color="item.border_color" />
						</template>

						<q-item
							v-for="link in item.links"
							:key="link.title"
							:clickable="!link.clickable_disabled"
							:disable="link.disable"
							tag="a"
							:to="!link.clickable_disabled ? link.link : null"
							:active="link.link === path.valueOf()">
							<MenuItem
								:title="link.title"
								:icon="link.icon"
								:caption="link.caption"
								:link="link.link"
								:border_color="link.border_color" />
						</q-item>
					</q-expansion-item>
				</div>
			</div>
		</q-list>
	</div>
</template>
