<template>
	<q-layout view="lHh Lpr fff" class="bg-grey-1">
		<q-page-container class="JLWidget__page-container">
			<div class="row justify-center">
				<div style="height: 80vh" class="zone2 col-12 overflow-auto">
					<div class="row">
						<q-card
							:class="widgetClass(widget.size)"
							v-for="(widget, index) in widgets2"
							:key="index"
							class="widget"
							bordered>
							<q-card-section class="q-pa-xs">
								<div class="row no-wrap">
									<div class="col">
										<div class="text-h6">{{ widget.title }}</div>
										<div class="text-subtitle2">{{ widget.description }}</div>
									</div>
								</div>
							</q-card-section>
							<component :is="comps[widget.content]" :type="widget.configs" />
						</q-card>
					</div>
				</div>
			</div>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useWidgetsStore } from '../../store/widgets'
import { JLChart } from '../../components/common/chart/'
import JLStats from './components/JLStats.vue'
import JLForm from './components/JLForm.vue'
import JLTable from './components/JLTable.vue'
import { widgetClass } from './utils'

export default {
	setup() {
		const comps = {
			JLChart,
			JLStats,
			JLForm,
			JLTable,
		}

		const widgetsStore = useWidgetsStore()
		const widgets2 = computed(() => widgetsStore.widgets)

		return {
			widgetClass,
			close,
			widgets2,
			comps,
		}
	},
}
</script>

<style>
.trash-container {
	justify-content: center;
	align-items: center;
	height: 85px;
}
.widget {
	min-height: 200px;
}
.zone3 {
	background: rgb(248, 142, 154);
	border: 2x solid red;
}
</style>
<style lang="sass">
.JLWidget
  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
