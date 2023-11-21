<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { App, AppStoreOptions, InstalledApp } from '../../types'
import { APPS_ENDPOINT, AppsService } from '../../services/app-store'
import { JLAppStoreConnect } from '../../components/app-store'

const props = defineProps<AppStoreOptions>()

const emit = defineEmits(['selected', 'installed'])

const $q = useQuasar()
const appsService = new AppsService()
const selectedApp = ref<App>(null)
const connectApp = ref<boolean>(false)

const apps = await appsService.findAll({
	url: APPS_ENDPOINT,
	q: $q,
})

async function select(app: App) {
	emit('selected', app)
	selectedApp.value = app
	connectApp.value = true
}

async function installed(installed_app: InstalledApp) {
	emit('installed', installed_app)
}

</script>

<template>

	<div v-for="app in apps" :key="app.app_id" class="q-pa-md row items-start q-gutter-md">
		<q-card class="q-ml-md q-mr-md">
			<q-card-section>
					<a href="#" @click="select(app)"><span :class="props.text?.classes ?? 'text-h5'">{{ app.name }}</span></a>
			</q-card-section>
			
		</q-card>
	</div>

	<q-dialog v-model="connectApp">
		<q-card class="q-ml-md q-mr-md">
			<JLAppStoreConnect
				:integration_name="selectedApp.integration_name"
				:icon="props.icon"
				@installed='installed' 
			/>
		</q-card>
	</q-dialog>

</template>