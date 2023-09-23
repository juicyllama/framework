<script setup lang="ts">
import { FormField, FormFieldPluginInstallAppOptions, InstalledApp } from '@/types/index.js'
import { JLAppStoreConnect } from '@/components/app-store/index.js'
import { ref, Ref } from 'vue'
import { Strings } from '@juicyllama/utils'

const props = defineProps<{
	field: FormField
}>()

const emit = defineEmits(['installed'])

const opened: Ref<boolean> = ref(false)

function installedApp(installed_app: InstalledApp) {
	opened.value = false
	emit('installed', installed_app)
}

const pluginOptions = <FormFieldPluginInstallAppOptions>props.field.pluginOptions

function openForm() {
	opened.value = true
}
</script>

<template>
	<q-btn
		:class="`JLButton JLButtonInstallApp JLButton${Strings.capitalize(field.key)}`"
		:key="field.key"
		:color="pluginOptions.button?.color ?? 'primary'"
		@click="openForm">
		<q-icon
			v-if="pluginOptions.button?.icon?.name"
			:name="`${pluginOptions.button?.icon?.type ?? 'fa-duotone'} ${pluginOptions.button?.icon?.name}`"
			class="JLIcon" />
		{{ pluginOptions.button?.label ?? 'Connect' }}
	</q-btn>

	<q-dialog v-model="opened">
		<q-card>
			<JLAppStoreConnect
				:integration_name="pluginOptions.integration_name"
				:icon="pluginOptions.icon"
				:connection="pluginOptions.connection"
				@installed="installedApp($event)" />
		</q-card>
	</q-dialog>
</template>
