<script setup lang="ts">
import { FlagProps, FlagType } from '../types/flags'

const props = defineProps<FlagProps>()

if(!props.type) props.type = FlagType.RECTANGULAR
if(!props.image_type) props.image_type = 'svg'

if(!props.size) {

	switch(props.type) {
		case FlagType.RECTANGULAR:
		case FlagType.ROUNDED_RECTANGLE:
			props.size = {
				width: 32,
				height: 20
			}
			break
		case FlagType.ROUNDED:
		case FlagType.SQUARE:
		case FlagType.HEXAGONAL:
		case FlagType.ROUNDED_SQUARE: 
		default: 
			props.size = {
				width: 32,
				height: 32
			}
			break
	}
}

let src = `../assets/flags/${props.type}/${props.image_type}/${props.country_code.toUpperCase()}.${props.image_type}`

</script>

<template>
	<img :class="`flag flag--${props.type} ${prop.classes.join(' ')}`" :src="src" width="props.size.width" height="props.size.height" />
</template>
