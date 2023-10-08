<template>
	<q-layout view="lHh Lpr fff" class="bg-grey-1">
		<q-page-container class="JLWidget__page-container">
			<div class="row justify-center">
				<div style="height: 80vh" class="zone2 col-12 overflow-auto">
					<div class="row">
						<q-card
							:class="widgetClass(widget.size)"
							v-for="(widget, index) in panel2"
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
import { ref, computed } from 'vue'
import WidgetForm from '@/components/WidgetForm.vue'
import { useWidgetsStore } from '@/stores/widgets'
import JLChart from '@/components/widgets/JLChart.vue'
import JLStats from '@/components/widgets/JLStats.vue'
import JLForm from '@/components/widgets/JLForm.vue'
import JLTable from '@/components/widgets/JLTable.vue'

const findWidgetById = (widgets, widget) => {
	return widgets.findIndex(el => el.id === widget.id)
}

export default {
	components: {
		WidgetForm,
	},
	setup() {
		const comps = {
			JLChart,
			JLStats,
			JLForm,
			JLTable,
		}

		const widgetClass = size => {
			if (size === 'SMALL') return 'col-6 col-md-3' // (3/12 on desktop / 6/12 mobile)
			if (size === 'MEDIUM') return 'col-12 col-md-6' // (6/12 on desktop / 12/12 mobile)
			if (size === 'LARGE') return 'col-12' //(12/12 on desktop / 12/12 mobile)
		}

		const widgetsStore = useWidgetsStore()
		const widgets2 = computed(() => widgetsStore.widgets)
		const panel2 = computed(() => widgets2.value)

		return {
			widgetClass,
			close,
			panel2,
			search,
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
