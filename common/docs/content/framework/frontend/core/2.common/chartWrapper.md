---
title: ChartWrapper
---

# JLChartWrapper

Transparent wrapper component that loads data that can be used to display any kind of chart or numeric data. Component doesn't render any data itself - only loading and providing it to a using component.

## Props

- `options.url` - API url to perform a GET call to retrieve data; Run on component mounted
- `data` - optional, if data is already present in the target component

## Events

- `loaded` - emited when data is available in the component; Event data contains loaded data;

## Slots

### Default

Main slot for displaying data and any additional markup.
Slot has access to values:

- `data` - `any` containg object returned by API, when data is loaded
- `isError` - `boolean`, indicates if request was successfull or not
- `isLoading` - `boolean`, indicates if request is in progress or done
- `loadChart` - `function` to call data loading again

### Error

Optional slot for custom error block. Visible when data loading fails with error.

### Loading

Optional slot for custom loading block. Visible while component is in loading state.

## Examples

Simplest usage with `default` slot and `Bar` component from ChartJS based on [Example with Vue + ChartJS](https://vue-chartjs.org/guide/#creating-your-first-chart){:target="_blank"}

Expected API response is `Number[]`, for example: `[40, 20, 12]`

```js
 <JLChartWrapper :options="{url: 'api/count'}">
        <template #default="{data, isError, isLoading}">
          <Bar v-if="!isLoading && !isError"
              :options="chartOptions"
              :data="addLabels(data)" />
        </template>
  </JLChartWrapper>
```

```js
  <script>
import { Bar } from 'vue-chartjs'
import {JLChartWrapper} from '@juicyllama/frontend-core'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  methods: {
   addLabels(dataFromAPI){
    return {
            labels: [ 'January', 'February', 'March' ],
            datasets: [ { data: dataFromAPI } ]
       }
    }
  }
  data() {
    return {
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>
```

Custom UI in loading and error blocks

```js
 <JLChartWrapper :options="{url: 'api/count'}">

        <!-- main slot for displaying data -->
        <template #default="{data, isError, isLoading, loadChart}">
          <Bar v-if="!isLoading && !isError"
              :options="chartOptions"
              :data="addLabels(data)" />
          <button v-if="!isLoading && isError" @click="loadChart">reload</button>
        </template>

        <!-- optional slot for custom error block-->
        <template #error>
          Error happened, while loading data!
        </template>

        <!-- optional slot for custom loading block-->
        <template #loading>
          <q-linear-progress dark rounded indeterminate color="secondary" class="q-mt-sm" />
        </template>
  </JLChartWrapper>
```
