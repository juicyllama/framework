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
