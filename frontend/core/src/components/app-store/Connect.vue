<script setup lang="ts">
import { useQuasar } from 'quasar'
import { AppStoreIntegrationName, ConnectAppOptions, FormSchema, LogSeverity } from '@/types/index.js'
import { logger } from '@/helpers/index.js'
import {
	APPS_ENDPOINT,
	AppsService,
	INSTALLED_APPS_ENDPOINT,
	InstalledAppsService,
} from '@/services/app-store/index.js'
import { reactive } from 'vue'
import { buildAppForm } from './appSettingsToForm.js'
import { JLForm } from '@/components/common/form/index.js'

const props = defineProps<ConnectAppOptions>()

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
	appForm.fields = buildAppForm(app[0], props.connection)
}

async function install(data: any) {
	//set form button to loading
	appForm.fields[appForm.fields.length - 1].loading = true

	const name = data.name ?? props.connection.name
	delete data.name

	try {
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
	} catch (error) {
		logger({
			severity: LogSeverity.WARN,
			message: 'Could not install app',
			object: error,
		})
	}
	appForm.fields[appForm.fields.length - 1].loading = false
}
</script>

<template>
	<div id="AppStoreConnect" v-if="app[0]" class="q-ml-lg q-mr-lg q-mb-lg">
		<q-icon
			v-if="props.integration_name === AppStoreIntegrationName.wordpress && !props.icon?.hide"
			name="fa-brands fa-wordpress"
			:size="props.icon?.size ?? '5rem'"
			:color="props.icon?.color ?? 'primary'"
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
