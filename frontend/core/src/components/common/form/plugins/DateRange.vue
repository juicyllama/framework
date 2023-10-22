<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { FormField, FormFieldPluginDateRangeOptions, FormFieldPluginDateRangeResult, FormFieldPluginDateRangeTypeOptions } from '../../../../types'
import { JLDropdownButtonMenu } from '../../menu';

const props = defineProps<{
	field: FormField
}>()

const emit = defineEmits(['updated'])

const pluginOptions = <FormFieldPluginDateRangeOptions>props?.field?.pluginOptions

const defaultDateRange: FormFieldPluginDateRangeResult = {
	type: FormFieldPluginDateRangeTypeOptions.TODAY,
	from: new Date(new Date().setUTCHours(0,0,0,0)),
	to: new Date(new Date().setUTCHours(23,59,59,599)),
}
const date_range: Ref<FormFieldPluginDateRangeResult> = ref(defaultDateRange)

if(localStorage.getItem('date_range')){	
	date_range.value = JSON.parse(localStorage.getItem('date_range'))
}

const customDateRange: Ref<{from: string, to: string} | string > = ref(formatDateForRange(date_range.value))
const showCustom: Ref<boolean> = ref(false)

	/**
	 * Converts the FormFieldPluginDateRangeResult format to Q-Date format 
	 */
function formatDateForRange(date: FormFieldPluginDateRangeResult): {from: string, to: string} | string {
	
	//if same dates, return single date
	if(new Date(date.from).toISOString().substring(0,10) === new Date(date.to).toISOString().substring(0,10)){
		return new Date(date.from).toISOString().substring(0,10)
	}
	
	return {
		from: new Date(date.from).toISOString().substring(0,10), 
		to: new Date(date.to).toISOString().substring(0,10),
	}
}

/**
* Converts the o Q-Date format back to a FormFieldPluginDateRangeResult format 
*/
function formatRangeFromDate(date: {from: string, to: string} | string): FormFieldPluginDateRangeResult {

	if(typeof date === 'string'){
		return {
			type: FormFieldPluginDateRangeTypeOptions.CUSTOM,
			from: new Date(new Date(date).setUTCHours(0,0,0,0)),
			to: new Date(new Date(date).setUTCHours(23,59,59,599)),
		}
	}else{
		return {
			type: FormFieldPluginDateRangeTypeOptions.CUSTOM,
			from: new Date(date.from),
			to: new Date(date.to),
		}
	}
}

function popCustom(){
	showCustom.value = true
}

function updated(dates: FormFieldPluginDateRangeResult) {
	showCustom.value = false
	localStorage.setItem('date_range', JSON.stringify(dates))
	emit('updated', dates)
	customDateRange.value = formatDateForRange(dates)
}

function updatedCustom(value: {from: string, to: string} | string){
	if(value){
		showCustom.value = false
		localStorage.setItem('date_range', JSON.stringify(formatRangeFromDate(value)))
		emit('updated', formatRangeFromDate(value))
	}	
}

watch(
	() => customDateRange.value,
	newValue => {
		updatedCustom(newValue)
	},
)

</script>

<template>
	<JLDropdownButtonMenu 
	auto-close
	:button="pluginOptions?.button" 
	:menu="{
		selected: date_range.type,
		items: [{
			title: 'Today',
			key: FormFieldPluginDateRangeTypeOptions.TODAY,
			function: () => {
				const date = new Date();
				const now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());
				updated({
					type: FormFieldPluginDateRangeTypeOptions.TODAY,
					from: new Date(new Date().setUTCHours(0,0,0,0)),
					to: new Date(now_utc)
				})
			}
		},{
			title: 'Last 24 Hours',
			key: FormFieldPluginDateRangeTypeOptions.LAST_24_HOURS,
			function: () =>	{
				const date = new Date();
				const now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());
				const Yesterday_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
				date.getUTCDate() - 1, date.getUTCHours(),
				date.getUTCMinutes(), date.getUTCSeconds());
				updated({
					type: FormFieldPluginDateRangeTypeOptions.LAST_24_HOURS,
					from: new Date(Yesterday_utc),
					to: new Date(now_utc)
				})
			}
		},{
			title: 'Yesterday',
			key: FormFieldPluginDateRangeTypeOptions.YESTERDAY,
			function: () => updated({
				type: FormFieldPluginDateRangeTypeOptions.YESTERDAY,
				from: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setUTCHours(0,0,0,0)),
				to: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setUTCHours(23,59,59,599)),
			})
		},{
			title: 'This Week',
			key: FormFieldPluginDateRangeTypeOptions.THIS_WEEK,
			function: () => {
				const date = new Date();
				const now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());

				const monday = date.setDate(date.getDate() - (date.getDay() + 6) % 7)
				const monday_utc = new Date(monday).setUTCHours(0,0,0,0)

				updated({
					type: FormFieldPluginDateRangeTypeOptions.THIS_WEEK,
					from: new Date(monday_utc),
					to: new Date(now_utc),
				})
			}
		},{
			title: 'Last Week',
			key: FormFieldPluginDateRangeTypeOptions.LAST_WEEK,
			function: () => {
				
				const date = new Date();
				const monday = date.setDate(date.getDate() - (date.getDay() + 6) % 7)
				const monday_utc = new Date(monday).setUTCHours(0,0,0,0)
				
				const previous_monday = new Date(monday_utc).setDate(date.getDate() - 7)

				updated({
					type: FormFieldPluginDateRangeTypeOptions.LAST_WEEK,
					from: new Date(previous_monday),
					to: new Date(monday_utc),
				})
			}
		},{
			title: 'This Month',
			key: FormFieldPluginDateRangeTypeOptions.THIS_MONTH,
			function: () => {
				const date = new Date();
				const now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds());

				const start_of_month = date.setDate(1)
				const start_of_month_utc = new Date(start_of_month).setUTCHours(0,0,0,0)

				updated({
					type: FormFieldPluginDateRangeTypeOptions.THIS_MONTH,
					from: new Date(start_of_month_utc),
					to: new Date(now_utc),
				})
			}
		},{
			title: 'Last Month',
			key: FormFieldPluginDateRangeTypeOptions.LAST_MONTH,
			function: () => {

				const date = new Date();
				const start_of_month = date.setDate(1)
				const start_of_month_utc = new Date(start_of_month).setUTCHours(0,0,0,0)
				
				const previous_month = new Date(start_of_month_utc).setMonth(date.getMonth() - 1)

				updated({
					type: FormFieldPluginDateRangeTypeOptions.LAST_MONTH,
					from: new Date(previous_month),
					to: new Date(start_of_month_utc),
				})
			}
		},
		{
			title: 'Custom',
			key: FormFieldPluginDateRangeTypeOptions.CUSTOM,
			function: () => popCustom()
		}]
	}">
	</JLDropdownButtonMenu>

	<q-date 
		v-if="showCustom" 
		v-model="customDateRange" 
		range
		mask="YYYY-MM-DD"
	/>

</template>
