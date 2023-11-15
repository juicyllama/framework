<script setup lang="ts">
import { ref, Ref, reactive } from 'vue'
import { FormField, FormFieldPluginDateRangeOptions, FormFieldPluginDateRangeResult, FormFieldPluginDateRangeTypeOptions } from '../../../../types'
import { JLDropdownButtonMenu } from '../../menu';
import { updateFormPluginDateRange } from '../../../../helpers'

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

const dates = reactive<{
	menu: Ref<FormFieldPluginDateRangeResult>,
	custom: Ref<{from: string, to: string} | string>,
	output: Ref<FormFieldPluginDateRangeResult>,
}>( {
	menu: ref(defaultDateRange),
	custom: ref(formatDateForRange(defaultDateRange)),
	output: ref(defaultDateRange),
})

if(localStorage.getItem('date_range')){	
	dates.menu = JSON.parse(localStorage.getItem('date_range'))
	dates.custom = formatDateForRange(JSON.parse(localStorage.getItem('date_range')))
	dates.output = JSON.parse(localStorage.getItem('date_range'))
}

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
function formatRangeFromDate(date: {from: string, to: string} | string, type?: FormFieldPluginDateRangeTypeOptions): FormFieldPluginDateRangeResult {

	if(typeof date === 'string'){
		return {
			type: type ?? FormFieldPluginDateRangeTypeOptions.CUSTOM,
			from: new Date(new Date(date).setUTCHours(0,0,0,0)),
			to: new Date(new Date(date).setUTCHours(23,59,59,599)),
		}
	}else{
		return {
			type: type ?? FormFieldPluginDateRangeTypeOptions.CUSTOM,
			from: new Date(new Date(date.from).setUTCHours(0,0,0,0)),
			to: new Date(new Date(date.to).setUTCHours(23,59,59,599)),
		}
	}
}

function popCustom(){
	showCustom.value = true
}

function updated(updated_dates: FormFieldPluginDateRangeResult) {
	showCustom.value = false
	dates.custom = formatDateForRange(updated_dates)
	dates.menu = updated_dates
	dates.output = updated_dates
	localStorage.setItem('date_range', JSON.stringify(updated_dates))
	emit('updated', updated_dates)
}

function updated_custom(range: {
    from: {
      year: number;
      month: number;
      day: number;
    };
    to: {
      year: number;
      month: number;
      day: number;
    };
  }) {

	const updated_range = formatRangeFromDate({
		from: `${range.from.year}-${range.from.month}-${range.from.day}`,
		to: `${range.to.year}-${range.to.month}-${range.to.day}`,
	}, FormFieldPluginDateRangeTypeOptions.CUSTOM)

	updated(updated_range)
}

</script>

<template>
	<JLDropdownButtonMenu 
	auto-close
	:button="pluginOptions?.button" 
	:menu="{
		selected: dates.menu.type,
		items: [{
			title: 'Today',
			key: FormFieldPluginDateRangeTypeOptions.TODAY,
			function: () => updated({
					...updateFormPluginDateRange({
						...dates.menu,
						type: FormFieldPluginDateRangeTypeOptions.TODAY,
					})
				})
		},{
			title: 'Last 24 Hours',
			key: FormFieldPluginDateRangeTypeOptions.LAST_24_HOURS,
			function: () =>	updated({
					...updateFormPluginDateRange({
						...dates.menu,
						type: FormFieldPluginDateRangeTypeOptions.LAST_24_HOURS,
					})
				})
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
			function: () => updated({
					...updateFormPluginDateRange({
						...dates.menu,
						type: FormFieldPluginDateRangeTypeOptions.THIS_WEEK,
					})
				})
		},{
			title: 'Last Week',
			key: FormFieldPluginDateRangeTypeOptions.LAST_WEEK,
			function: () => updated({
					...updateFormPluginDateRange({
						...dates.menu,
						type: FormFieldPluginDateRangeTypeOptions.LAST_WEEK,
					})
				})
		},{
			title: 'This Month',
			key: FormFieldPluginDateRangeTypeOptions.THIS_MONTH,
			function: () => updated({
					...updateFormPluginDateRange({
						...dates.menu,
						type: FormFieldPluginDateRangeTypeOptions.THIS_MONTH,
					})
				})
		},{
			title: 'Last Month',
			key: FormFieldPluginDateRangeTypeOptions.LAST_MONTH,
			function: () => updated({
					...updateFormPluginDateRange({
						...dates.menu,
						type: FormFieldPluginDateRangeTypeOptions.LAST_MONTH,
					})
				})
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
		:model-value="dates.custom" 
		range
		@range-end="updated_custom"
		mask="YYYY-MM-DD"
	/>

</template>
