<template>
  <ClientOnly>
    <embed type="text/html" :src="props.demo" width="100%" height="500">
  </ClientOnly>
  <!-- <UTabs :items="items">
		<template #item="{ item }">
			<div v-if="item.label ==='Code'" class="p-4">
				<ClientOnly>
					<div v-html="item.content"></div>
				</ClientOnly>
			</div>
			<div v-if="item.label ==='Demo'" class="p-4">
				<ClientOnly>
				{{ item.content }}
				<embed type="text/html" :src="item.content" width="100%" height="100%">
				</ClientOnly>
			</div>
		</template>
	</UTabs> -->
</template>
<script setup lang="ts">

const props = defineProps({
	// code: String,
	demo: String,
})

// const items = ref([{
//   label: 'Code',
//   content: props.code
// }, {
//   label: 'Demo',
//   content: props.demo
// }])
</script>
