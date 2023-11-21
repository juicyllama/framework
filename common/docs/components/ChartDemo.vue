<script setup>
import { JLChart } from '@juicyllama/frontend-core'

const date_range = {
	from: '2021-01-01',
	to: '2023-10-01',
}

const dataMapper = (data, field = 'total_price') => {
	const datasets = []
	let count = 0
	data.datasets.forEach(dataset => {
		if (count < dataset.data.length) {
			count = dataset.data.length
		}
		datasets.push({
			data: dataset.data.map(i => i[field]),
			label: dataset.label,
		})
	})
	return {
		labels: Array(count).fill(data.datasets[0].label),
		datasets,
	}
}

const dataMapperForAPI = (data, field = 'total_price') => {
	const datasets = []
	let count = 0
	data.datasets.forEach(dataset => {
		if (count < dataset.data.length) {
			count = dataset.data.length
		}
		datasets.push({
			data: dataset.data.map(i => i[field]),
			label: dataset.label,
		})
	})
	return {
		labels: Array(count).fill(data.datasets[0].label),
		datasets,
	}
}

const labels = ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg']
const dataStatic = {
	labels: labels,
	datasets: [
		{
			label: 'Dataset 1',
			data: [10, 20, 30, 40, 50, 60, 70],
			borderColor: 'red',
			backgroundColor: 'red',
		},
		{
			label: 'Dataset 2',
			data: [10, 20, 30, 40, 50, 60, 70].reverse(),
			borderColor: 'blue',
			backgroundColor: 'blue',
		},
	],
}

const dataForDataMapper = {
	datasets: [
		{
			label: 'Dataset 1',
			data: [
				{ total_price: 10 },
				{ total_price: 20 },
				{ total_price: 30 },
				{ total_price: 40 },
				{ total_price: 50 },
				{ total_price: 60 },
				{ total_price: 70 },
			],
			borderColor: 'red',
			backgroundColor: 'red',
		},
		{
			label: 'Dataset 2',
			data: [
				{ total_price: 10 },
				{ total_price: 20 },
				{ total_price: 30 },
				{ total_price: 40 },
				{ total_price: 50 },
				{ total_price: 60 },
				{ total_price: 70 },
			].reverse(),
			borderColor: 'blue',
			backgroundColor: 'blue',
		},
	],
}

const ECOMMERCE_TRANSACTIONS_ENDPOINT = 'http://localhost:3000'
</script>
<template>
	<!-- local Bar :) -->
	<div class="row">
		<div class="col-md-4 col-6">
			<div style="height: 200px">
				<JLChart :data="dataStatic" type="bar" title="Bar with local 'dataStatic'" />
			</div>
		</div>
		<div class="col-md-4 col-6">
			<code
				>const dataStatic = { labels: labels, datasets: [ { label: 'Dataset 1', data: [10, 20, 30, 40, 50, 60,
				70], borderColor: 'red', backgroundColor: 'red', }, { label: 'Dataset 2', data: [10, 20, 30, 40, 50, 60,
				70].reverse(), borderColor: 'blue', backgroundColor: 'blue', } ] };</code
			>
		</div>
	</div>

	<!-- local line -->
	<div style="height: 200px">
		<JLChart :data="dataStatic" type="line" title="Line with local 'dataStatic'" />
	</div>
	<!-- local line with dataMapper -->
	<JLChart :data="dataForDataMapper" :dataMapper="dataMapper" type="line" title="Line with dataMapper" />
	<div style="height: 200px">
		<JLChart
			:data="{
				datasets: [dataForDataMapper.datasets[0]],
			}"
			:dataMapper="dataMapper"
			type="pie"
			title="pie with dataMapper, single DS" />
	</div>
	<JLChart
		dynamic-data
		:endpoint="`${ECOMMERCE_TRANSACTIONS_ENDPOINT}/charts?from=${date_range.from}&to=${date_range.to}&period=DAY&fields=total_price`"
		type="bar"
		:dataMapper="dataMapperForAPI"
		title="bar from /api" />

	<JLChart
		dynamic-data
		:dataMapper="dataMapperForAPI"
		:endpoint="`${ECOMMERCE_TRANSACTIONS_ENDPOINT}/charts?from=${date_range.from}&to=${date_range.to}&period=DAY&fields=total_price`"
		type="line"
		title="line from /api" />
</template>
