<template>
<div class="jl-chart">
	<slot v-if="isLoading" name="loading">
	<div>Loading data...</div>
	</slot>
	<slot v-if="isError" name="error">
	<div>Error loading chart</div>
	</slot>
	<slot :isLoading="isLoading" :isError="isError" :loadChart="loadChart" :data="dataLoadedFromAPI">
	</slot>
	<slot name="header"></slot>
</div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  const props = defineProps({
	options: Object,
	data: Object
  })

  const emit = defineEmits(['loaded'])
  const isLoading = ref(true)
  const isError = ref(false)
  const dataLoadedFromAPI = ref({})

  const loadChart = async (url) => {
	try {
	  const response = await fetch(url)
	  dataLoadedFromAPI.value = await response.json()
	  emit('loaded', dataLoadedFromAPI.value)
	} catch (error) {
	  isError.value = true
	} finally {
	  isLoading.value = false
	}
  }

  const setData = (newData) => {
	dataLoadedFromAPI.value = newData
	isLoading.value = false
	emit('loaded')
  }

  onMounted(() => {

	if(props.options?.url){
		loadChart(props.options.url)
	  return
	}
	if(props.data) {
		setData(props.data)
		return
	}
  })



</script>
