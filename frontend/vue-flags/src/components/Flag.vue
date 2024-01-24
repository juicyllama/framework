<script setup lang="ts">
import { FlagProps, FlagType } from '../types/flags'
import { computed } from 'vue'

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
		default:
			width = '32px'
			height = '32px'
			break
	}
}
const PATH_TO_FLAGS = '../assets/flags/'
const glob = import.meta.glob(`../assets/flags/**/*.svg`, { eager: true })

const images = computed(() => Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [key.replace(PATH_TO_FLAGS, ''), value['default']])
))
const pathToRightFile = computed(() => images.value[`${type}/${image_type}/${props.country_code.toUpperCase()}.${image_type}`])
</script>

<template>
	<img :class="`flag flag--${type} ${props.classes?.join(' ') ?? ''}`" :src="pathToRightFile" :width="width" :height="height" />
</template>
