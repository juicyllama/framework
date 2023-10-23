<template>
	<q-layout view="lHh Lpr fff" class="bg-grey-1">
		<q-header elevated class="bg-white text-grey-8" height-hint="64">
			<q-toolbar class="JLWidget__toolbar" style="height: 64px">
				<q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
					<span class="q-ml-sm">Dashboard</span>
				</q-toolbar-title>

				<q-space />

				<q-input
					class="JLWidget__toolbar-input"
					dense
					standout="bg-primary"
					v-model="search"
					placeholder="Search">
					<template v-slot:prepend>
						<q-icon v-if="search === ''" name="search" />
						<q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
					</template>
				</q-input>

				<q-btn
					v-if="$q.screen.gt.xs"
					@click="onShowForm"
					flat
					dense
					no-wrap
					color="primary"
					icon="add"
					no-caps
					label="Create"
					class="q-ml-sm q-px-md">
				</q-btn>
				<q-btn
					v-if="$q.screen.gt.xs"
					@click="saveDashboard"
					flat
					dense
					no-wrap
					icon="save"
					no-caps
					label="Save page"
					class="q-ml-sm q-px-md">
				</q-btn>

				<q-space />
			</q-toolbar>
		</q-header>

		<q-dialog v-model="showWidgetEditForm">
			<WidgetForm @add="onAddorEditWidget" @close="close" />
		</q-dialog>

		<q-page-container class="JLWidget__page-container">
			<div class="row justify-center">
				<div @dragover.prevent @drop="onDrop($event)" style="height: 80vh" class="zone2 col-12 overflow-auto">
					<div class="row">
						<template v-if="widgets2.length === 0">
							<div class="col-12 text-center">
								<div class="text-h6">Drag and drop widgets here, or press "Create"</div>
							</div>
						</template>

						<q-card
							:class="widgetClass(widget.size)"
							v-for="(widget, index) in widgets2"
							@dragover.prevent
							:key="index"
							class="widget"
							@drop="resortDrop($event, widget, index)"
							@dragstart="onDragStart($event, widget, 'zone2')"
							draggable="true"
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
							<!-- {{ widget }} -->
						</q-card>
					</div>
				</div>
			</div>

			<q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
				<div class="fit q-pt-xl q-px-sm column">
					<q-btn
						draggable="true"
						@dragstart="onDragStart($event, { title: 'Table', size: 'MEDIUM', bg: '#ff0000' }, 'zone1')"
						round
						flat
						color="grey-8"
						stack
						no-caps
						size="26px"
						class="JLWidget__side-btn">
						<q-icon size="22px" name="table_rows" />
						<div class="JLWidget__side-btn__label">Table</div>
					</q-btn>

					<q-btn
						draggable="true"
						@dragstart="onDragStart($event, { title: 'Form', size: 'MEDIUM', bg: '#ff0000' }, 'zone1')"
						round
						flat
						color="grey-8"
						stack
						no-caps
						size="26px"
						class="JLWidget__side-btn">
						<q-icon size="22px" name="edit_note" />
						<div class="JLWidget__side-btn__label">Form</div>
					</q-btn>

					<q-btn
						draggable="true"
						@dragstart="onDragStart($event, { title: 'Chart', size: 'MEDIUM', bg: '#ff0000' }, 'zone1')"
						round
						flat
						color="grey-8"
						stack
						no-caps
						size="26px"
						class="JLWidget__side-btn">
						<q-icon size="22px" name="insert_chart_outlined" />
						<div class="JLWidget__side-btn__label">Chart</div>
						<q-badge floating color="red" text-color="white" style="top: 8px; right: 16px"> 1 </q-badge>
					</q-btn>

					<q-btn
						draggable="true"
						@dragstart="onDragStart($event, { title: 'Stats', size: 'SMALL', bg: '#ff0000' }, 'zone1')"
						round
						flat
						color="grey-8"
						stack
						no-caps
						size="26px"
						class="JLWidget__side-btn">
						<q-icon size="22px" name="insights" />
						<div class="JLWidget__side-btn__label">Stats</div>
					</q-btn>
				</div>
			</q-page-sticky>
		</q-page-container>

		<div v-show="isDragging" class="zone3 col-12 align-self-end" @dragover.prevent @drop="onDropTrash($event)">
			<div class="bg-error trash-container">
				<q-icon size="32px" color="white" class="q-mt-sm" name=" delete_forever" />
				<p class="text-white">Delete</p>
			</div>
		</div>
	</q-layout>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import WidgetForm from './components/WidgetForm.vue'
import { useWidgetsStore } from '../../store/widgets'
import { JLChart } from '../../components/common/chart'
import JLStats from './components/JLStats.vue'
import JLForm from './components/JLForm.vue'
import JLTable from './components/JLTable.vue'
import { saveWidgets } from '../../services/widgets'
import { widgetClass } from './utils'

const findWidgetById = (widgets, widget) => widgets.findIndex(el => el.id === widget.id)

export default {
	components: {
		WidgetForm,
	},
	setup() {
		const leftDrawerOpen = ref(false)
		const search = ref('')
		const showWidgetEditForm = ref(false)

		const comps = {
			JLChart,
			JLStats,
			JLForm,
			JLTable,
		}

		const isDragging = ref(false)
		const widgetsStore = useWidgetsStore()
		const widgets2 = ref([])

		onMounted(() => {
			const dashboard = localStorage.getItem('dashboard')
			if (dashboard) {
				widgetsStore.widgets = JSON.parse(dashboard)
				widgets2.value = JSON.parse(dashboard)
			}
		})

		//TODO: remove when API is ready
		//const LS_KEY_FOR_DATA = 'dashboard'

		const close = () => {
			showWidgetEditForm.value = false
		}
		const onShowForm = () => {
			showWidgetEditForm.value = true
		}
		const onAddorEditWidget = () => {
			showWidgetEditForm.value = false
			widgets2.value = widgetsStore.widgets
		}

		const saveDashboard = () => {
			saveWidgets(widgets2.value)
			//TODO: remove when API is ready, show notification
			//localStorage.setItem(LS_KEY_FOR_DATA, JSON.stringify(widgetsStore.widgets))
		}

		const onDragStart = (event, widget, src) => {
			let data = {
				widget,
				src,
			}
			if (src === 'zone1') {
				data.widget = {
					...widget,
					id: Date.now(),
				}
			}

			event.dataTransfer.setData('text/plain', JSON.stringify(data))
			if (src === 'zone2') {
				isDragging.value = true
			}
		}

		const onDrop = event => {
			const data = JSON.parse(event.dataTransfer.getData('text/plain'))
			isDragging.value = false
			const existIndex = findWidgetById(widgets2.value, data.widget)
			if (existIndex != -1) {
				// do resort
			} else {
				widgets2.value.push(data.widget)
			}
		}

		const resortDrop = (event, widget2, index2) => {
			const data = JSON.parse(event.dataTransfer.getData('text/plain'))
			if (data.src == 'zone2') {
				const existIndex = findWidgetById(widgets2.value, data.widget)
				widgets2.value[existIndex] = widget2
				widgets2.value[index2] = data.widget
			} else {
				onDrop(event)
			}
		}

		const onDropTrash = event => {
			const data = JSON.parse(event.dataTransfer.getData('text/plain'))
			isDragging.value = false
			if (data.src == 'zone2') {
				const existIndex = findWidgetById(widgets2.value, data.widget)
				if (existIndex != -1) {
					widgets2.value.splice(existIndex, 1)
				}
			}
		}

		return {
			saveDashboard,
			widgetClass,
			close,
			onShowForm,
			onAddorEditWidget,
			leftDrawerOpen,
			search,
			isDragging,
			widgets2,
			showWidgetEditForm,
			comps,
			onDropTrash,
			resortDrop,
			onDrop,
			onDragStart,
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

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
