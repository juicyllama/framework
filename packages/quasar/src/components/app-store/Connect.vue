<script setup lang="ts">
import { useQuasar } from 'quasar'
import { AppStoreIntegrationName, FormSchema, LogSeverity } from '@/types'
import { logger } from '@/helpers'
import { APPS_ENDPOINT, AppsService, INSTALLED_APPS_ENDPOINT, InstalledAppsService } from '@/services/app-store'
import { reactive } from 'vue'
import { buildAppForm } from '@/components/app-store/appSettingsToForm'
import { JLForm } from '@/components/common/form'

const props = defineProps<{
	integration_name: AppStoreIntegrationName
}>()

const emit = defineEmits(['installed'])

const $q = useQuasar()
const appsService = new AppsService()
const installedAppsService = new InstalledAppsService()
let appForm: FormSchema = reactive({
	fields: [],
})

const app = await appsService.findAll({
	url: APPS_ENDPOINT,
	find: {
		integration_name: props.integration_name,
	},
	q: $q,
})

if (!app.length) {
	logger({
		severity: LogSeverity.ERROR,
		message: `Could not find app with integration name ${props.integration_name}`,
	})
} else {
	appForm.fields = buildAppForm(app[0])
}

async function install(data: any) {
	const name = data.name
	delete data.name

	const installed_app = await installedAppsService.create({
		url: INSTALLED_APPS_ENDPOINT,
		data: {
			app_id: app[0].app_id,
			name: name,
			settings: data,
		},
		q: $q,
	})

	emit('installed', installed_app)
}
</script>

<template>
	<div id="AppStoreConnect" v-if="app[0]" class="q-ml-lg q-mr-lg q-mb-lg">
		<q-icon
			v-if="props.integration_name === AppStoreIntegrationName.wordpress"
			name="fa-brands fa-wordpress"
			size="5rem"
			color="primary"
			class="q-mt-xl q-mb-xl" />

		<JLForm :options="appForm" @submittedForm="install"></JLForm>
	</div>
</template>

<style scoped>
#AppStoreConnect {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
