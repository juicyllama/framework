---
title: Chart
---

# JLChart

Alows to display various data charts - Bar, Line, Pie along with custom ones.
Based on [chartjs](https://www.chartjs.org/) library.

## Props

- `options` -
- `data` - object for static data
- `type` - 'pie' | 'line' | 'bar'
- `endpoint` - string, endpoint to call
- `title` - string, title to display
- `dynamicData` - boolean, load data from API, false by default
- `displayLegend` - boolean, show legend
- `displayTooltip` - boolean, show tooltip
- `dataMapper` - transformation function that will be applied to the loaded data before drawing the chart of any type

## Examples

```vue
<script lang="ts" setup>
import { JLChart } from '@juicyllama/frontend-core'

const staticData = reactive({
labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
datasets: [
    {
    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
    data: [40, 20, 80, 10],
    },
],
})

// optional
const defaultChartSettings = ref({
    responsive: true,
    maintainAspectRatio: true
})
</script>

<template>
    <!--Chart from local data-->
    <JLChart :data="dataForLIne"
            :type="'line'"/>

    <!--Chart from API data-->
    <JLChart dynamic-data
            :endpoint="'users/revenue/stats'"
            :title="'Bar chart'"
            :type="'bar'"
            :options="defaultChartSettings"/>

</template>
```

Using transformation function:

```js
const dataMapper = (data, field = 'total_price') => {
	const datasets = []
	let count = 0
	data.datasets.forEach(dataset => {
		if (count < dataset.data.length) {
			count = dataset.data.length
		}
		datasets.push({
			data: dataset.data.map(i => i[field]),
			label: dataset.label,
		})
	})
	return {
		labels: Array(count).fill(data.datasets[0].label),
		datasets,
	}
}

const dataForDataMapper = {
  datasets: [
    {
      label: 'Dataset 1',
      data: [
        { total_price: 10 },
        { total_price: 20 },
        { total_price: 30 },
        { total_price: 40 },
        { total_price: 50 },
        { total_price: 60 },
        { total_price: 70 },
      ],
      borderColor: 'red',
      backgroundColor: 'red',
    },
    {
      label: 'Dataset 2',
      data: [
        { total_price: 10 },
        { total_price: 20 },
        { total_price: 30 },
        { total_price: 40 },
        { total_price: 50 },
        { total_price: 60 },
        { total_price: 70 },
      ].reverse(),
      borderColor: 'blue',
      backgroundColor: 'blue',
    }
  ]
};

<JLChart
	:data="dataForDataMapper"
	:dataMapper="dataMapper"
	type="line"
	title="Line chart with dataMapper"/>
```
