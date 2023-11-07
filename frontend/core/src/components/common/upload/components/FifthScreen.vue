<template>
	<q-card-section class="q-pt-none q-pb-none">
		<div class="text-weight-bold">
			We have gathered all information the wizard needs to import your data. Click the Start button to begin
			importing.
		</div>
	</q-card-section>
	<q-card-section>
		<q-linear-progress
			v-if="uploadResult.status === 'LOADING'"
			dark
			rounded
			indeterminate
			color="secondary"
			class="q-mt-sm" />
		<template v-else>
			<template v-if="uploadResult.status === 'ERROR'">
				<q-banner inline-actions class="text-white bg-red">
					There was one or more errors during the import process.
					<br />
				</q-banner>
				<p>
					{{ uploadResult.details.error[0] }}
				</p>
			</template>
			<q-banner v-else inline-actions class="text-white bg-green">
				Import file was successfully uploaded!
			</q-banner>
			<p>
				Total processed: {{ uploadResult.details.total }}<br />
				Processed: {{ uploadResult.details.processed }}<br />
				Created: {{ uploadResult.details.created }}<br />
				Updated: {{ uploadResult.details.updated }}<br />
				Deleted: {{ uploadResult.details.deleted }}<br />
				Errored: {{ uploadResult.details.errored }}<br />
			</p>
		</template>
	</q-card-section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUploaderStore } from '../../../../store/uploader'

type uploadResult = {
	status: string
	details?: {
		total: number
		processed: string
		created: string
		updated: string
		deleted: string
		errored: string
		error: string[]
	}
}

const store = useUploaderStore()
const uploadResult = computed<uploadResult>(() => store.uploadResult as uploadResult)
</script>
