<script setup lang="ts">
defineProps({
  error: Object
})

const handleError = () => {
	clearError({ redirect: '/' })
}
</script>

<template>
	<div class="relative z-[1] text-center mt-16">
		<div class="mb-10">
			<span type="button"
				class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 text-xs gap-x-1.5 px-2.5 py-1.5 ring-1 ring-inset ring-current text-primary-500 dark:text-primary-400 disabled:bg-transparent dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center font-semibold hover:bg-primary-100 dark:hover:bg-primary-900 rounded-full">
				 Error occured
			</span>
		</div>
		<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl"> 404 </h2>
		<h4 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl"> Page not found </h4>
		<a type="button"
				class="button-primary mt-16"
				@click="handleError">Back to homepage
			</a>
	</div>
</template>
