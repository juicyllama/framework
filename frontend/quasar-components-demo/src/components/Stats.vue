
<template>
    <section class="JLStats">
        <header>
            <h4 class="JLStats__title">Mobile Stats</h4>
            <router-link class="JLStats__link" to="https://google.com/">More details</router-link>
        </header>
        <p class="JLStats__description">Mobile performance highlights</p>
        <section class="JLStats__data">

            <JLStats v-bind="inputStatic" @click="onClickHandler"/>
            <JLStats v-bind="inputStaticAnimated"/>
            <JLStats v-bind="inputWithEndpoint"/>
            <JLStats v-bind="inputWithErrorpoint"/>

            <q-btn no-caps @click="changeInputStatic">Change value</q-btn>

        </section>
    </section>


</template>

<script setup lang="ts">
import { JLStats } from '../../../quasar' // @juicyllama/quasar
import {ref} from 'vue'

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const inputWithEndpoint = ref({
    endpoint:'http://localhost:3000/stats-slow',
    dynamicData: true
})
const inputWithErrorpoint = ref({
    endpoint:'http://localhost:3000/stats-500',
    dynamicData: true
})

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
const inputStaticAnimated = ref({
    ...inputStatic.value,
    animated: true
})

const changeInputStatic = () => {
    inputStatic.value.value.value = getRandomInt(100, 10000)
}

const onClickHandler = () => {
    console.log('onClickHandler')
}
//     {
//         title: 'App visitor form AppStore',
//         value: {
//             value: '10,964',
//             valueMeasurement: '$',
//             signOnTheLeft: false,
//             valueSign: ''
//         },
//         delta: {
//             value: '10428',
//             valueMeasurement: '',
//             signOnTheLeft: true,
//             valueSign: '+'
//         }
//     }]
// })
</script>
<style>

.JLStats header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 1em;
}
.JLStats__title {
    font-size: 1.1em;
}
.JLStats__link {
    font-size: 0.9em;
    text-decoration: underline;
    padding-left: 0.5em;
}
.JLStats__data {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>
