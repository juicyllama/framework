<script setup>
import { JLStats } from '@juicyllama/frontend-core'
import { ref } from 'vue'

const inputStatic = ref({
    title: 'Website visitor using mobile',
    value: {
        value: 4964,
        valueMeasurement: '',
        signOnTheLeft: false,
        valueSign: ''
    },
    delta: {
        value: 428,
        valueMeasurement: '',
        signOnTheLeft: true,
        valueSign: '-'
    }
})

const inputWithAPIEndpoint = ref({
    endpoint:'/api/users/stats',
    dynamicData: true
})
</script>
<template>
    <div class="row">
    <div class="col-md-4 col-6">
    <!--Stats widget from local data-->
    <JLStats v-bind="inputStatic"/>
    </div>
    <div class="col-md-4 col-6">
    Data: <br>
    <code>
        {
    title: 'Website visitor using mobile',
    value: {
        value: 4964,
        valueMeasurement: '',
        signOnTheLeft: false,
        valueSign: ''
    },
    delta: {
        value: 428,
        valueMeasurement: '',
        signOnTheLeft: true,
        valueSign: '-'
    }
    </code>
    </div>
</div>

    <!--Stats widget from API data-->
    <JLStats v-bind="inputWithAPIEndpoint"/>
</template>
