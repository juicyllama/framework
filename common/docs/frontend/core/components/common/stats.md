---
title: Stats
---

# JLStats

Provides a widget that displays numeric data (count visitors, total revenue, product share) with additional delta change value.

## Props

- `value` - main value to display, optionaly with a sign ($100, 50%, etc)
- `delta` - delta value to display, optionaly with a sign (+10%, -50 ppl, etc)
- `endpoint` - URL to load data
- `dynamicData` - boolean, activates `endpoint` for loading data
- `animated` - boolean, add animation for a number

For `value` and `delta` data consists of following fields:

- `value` - actual main number to display
- `valueMeasurement` - parameter that is displayed,
- `signOnTheLeft` - boolean, on which side of the `value` the sign should be shown
- `valueSign` - actual value sign, e.g. `$`, `%` etc

## Example

<!-- <ClientOnly>
	<JLStats v-bind="{title: 'Website visitor using mobile',
		value: {
			value: 4964,
			valueMeasurement: '',
			signOnTheLeft: false,
			valueSign: ''
		}}"/>
</ClientOnly> -->


```vue
<script lang="ts" setup>
import { JLStats } from '@juicyllama/frontend-core'

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
    <!--Stats widget from local data-->
    <JLStats v-bind="inputStatic"/>

    <!--Stats widget from API data-->
    <JLStats v-bind="inputWithAPIEndpoint"/>
</template>
```
