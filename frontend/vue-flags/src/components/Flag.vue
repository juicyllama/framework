<script setup lang="ts">
import { FlagProps, FlagType } from '../types/flags'

const props = defineProps<FlagProps>()

const type = props.type ?? FlagType.RECTANGULAR
const image_type = 'svg'
let width = props.size?.width
let height = props.size?.height

if(!width || !height) {

	switch(type) {
		case FlagType.RECTANGULAR:
		case FlagType.ROUNDED_RECTANGLE:
			width = '32px'
			height= '20px'
			break
		case FlagType.ROUND:
		case FlagType.SQUARE:
		case FlagType.HEXAGONAL:
		case FlagType.ROUNDED_SQUARE:
		default:
			width = '32px'
			height = '32px'
			break
	}
}

let src = `../assets/flags/${type}/${image_type}/${props.country_code.toUpperCase()}.${image_type}`

</script>

<template>
	{{ src }}
	<img :class="`flag flag--${type} ${props.classes?.join(' ')}`" :src="src" :width="width" :height="height" />
</template>
