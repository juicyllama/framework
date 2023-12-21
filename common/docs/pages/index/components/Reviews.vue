<template>
  <div class="py-24 sm:py-32 dark:bg-gradient-to-b from-gray-900 to-gray-950">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
      <div class="text-center flex flex-col items-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span>Trusted by the<br><span class="text-primary">World Wide Web.</span></span>
        </h2>
      </div>
      <div class="column-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        <div v-for="item in reviews" :key="item.link" class="break-inside-avoid py-0.5">
          <div
            class="overflow-hidden rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 dark:bg-gradient-to-b from-gray-700/50 to-gray-900/50 relative group hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-900/50"
          >
            <div class="flex-1 px-4 py-5 sm:p-6 dark:bg-gray-900/50">
              <a
                :href="item.link" rel="noopener noreferrer" target="_blank" aria-label="Card link"
                class="focus:outline-none" tabindex="-1"
              >
                <span class="absolute inset-0" aria-hidden="true" />
              </a>
              <q class="italic text-lg text-gray-500 dark:text-gray-400">{{ item.text }}</q>
              <div class="flex gap-x-4 items-center mt-6">
                <span
                  class="relative inline-flex items-center justify-center flex-shrink-0 rounded-lg h-10 w-10 text-base"
                ><img
                  class="rounded-lg h-10 w-10 text-base" :alt="item.name" :src="item.img" :srcset="item.img2x"
                  loading="lazy"
                >
                </span>
                <div class="min-w-0">
                  <p class="font-semibold text-primary">
                    {{ item.name }}
                  </p>
                  <p class="text-sm truncate">
                    {{ item.position }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const reviews = [
	{
		text: '',
		img: '',
		img2x: '',
		name: '',
		position: '',
		link: ''
	}
]
</script>
