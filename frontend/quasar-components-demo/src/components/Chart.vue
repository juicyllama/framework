<template>
    <div>
      <q-btn no-caps @click="changeInputStatic">Change value</q-btn><br>
<code>
{{ staticData }}
</code>
        <h2>Static / Dynamic from props</h2>
        <section>
        <div style="width: 500px;">
          <JLChart :key="keyId" :data="staticData" :title="'--== Chart with a long title ==--'" display-legend :type="'pie'" :options="defaultChartSettings"/>
        </div>
        <div style="width: 500px;">
        <JLChart :data="dataForLIne" :title="'LINE chart'" :type="'line'" :options="defaultChartSettings"/>
      </div>
      <div style="width: 500px;">
        <p>without options</p>
        <JLChart :data="dataForLIne" :type="'line'"/>
      </div>
      <div style="width: 500px;">
        <JLChart :key="keyId" :data="staticData" :title="'Bar chart'" :type="'bar'" :options="defaultChartSettings"/>
        </div>
        <!-- <div style="width: 500px;">
        <JLChart :data="staticData" :type="'gauge'" :options="defaultChartSettings"/>
      </div> -->
      </section>
        <h2>Dynamic from API</h2>
        <section>
        <div style="width: 500px;">
        <p>should be error</p>
        <JLChart dynamic-data :endpoint="'http://localhost:3000/stats-500'" :title="'Dynamic chart'" :type="'bar'" :options="defaultChartSettings"/>
      </div>
      <div style="width: 500px;">
        <p>loading state</p>
        <JLChart dynamic-data :endpoint="'http://localhost:3000/charts-bar-slow'" :title="'Dynamic chart'" :type="'bar'" :options="defaultChartSettings"/>
      </div>
      <div style="width: 500px;">
        <p>regular bar</p>
        <JLChart dynamic-data :endpoint="'http://localhost:3000/charts-bar'" :title="'bar chart'" :type="'bar'" :options="defaultChartSettings"/>
      </div>
      <div style="width: 500px;">
        <p>regular line</p>
        <JLChart dynamic-data :endpoint="'http://localhost:3000/charts-line'" :title="'bar chart'" :type="'line'" :options="defaultChartSettings"/>
      </div>
      </section>
    </div>
</template>
<script setup>
/*
    USE BRANCH: dev/add-jlchart-basic
**/
import { JLChart } from '../../../quasar' // @juicyllama/quasar
import {ref, reactive} from 'vue'

// for line chart
const DATA_COUNT = 12;
const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
  labels.push(i.toString());
}
const datapoints = [0, 20, 20, 60, 60, 120, NaN, 180, 120, 125, 105, 110, 170];
const dataForLIne = {
  labels: labels,
  datasets: [
    {
      label: 'Cubic interpolation (monotone)',
      data: datapoints,
      borderColor: '#ff0000',
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4
    }, {
      label: 'Cubic interpolation',
      data: datapoints,
      borderColor: '#00ff00',
      fill: false,
      tension: 0.4
    }, {
      label: 'Linear interpolation (default)',
      data: datapoints,
      borderColor: '#0000ff',
      fill: false
    }
  ]
};

// for other types
const staticData = reactive({
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10],
    },
  ],
})

const defaultChartSettings = ref({
    responsive: true,
    maintainAspectRatio: true
})

const keyId = ref(0)

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const changeInputStatic = () => {
  staticData.datasets[0].data = [getRandomInt(0, 100), getRandomInt(0, 100), getRandomInt(0, 100), getRandomInt(0, 100)]
  keyId.value += 1
}
</script>
<style>
section {
  display: flex;
  flex-direction: row;
}
</style>
