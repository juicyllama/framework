<script setup lang="ts">

import { withoutTrailingSlash } from 'ufo'
import CommonForFolders from './commonForFolders.vue';

definePageMeta({
  layout: 'docs',
  colorMode: 'dark',
})

const route = useRoute()
const { toc, seo } = useAppConfig()

const subpages = ref(null)
const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
if (!page.value) {
	subpages.value = await useAsyncData(route.path, () => queryContent(route.path).only(['title', 'description', '_path']).find())

	if (subpages.value?.data?.length === 0) {
		throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
	}
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryContent()
  .where({ _extension: 'md', navigation: { $ne: false } })
  .only(['title', 'description', '_path'])
  .findSurround(withoutTrailingSlash(route.path))
)

const descriptionOrTitle = computed(() => page.value.description || page.value.title)

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  title: page.value.title,
  ogTitle: `${page.value.title} - ${seo?.siteName}`,
  description: descriptionOrTitle.value,
  ogDescription: descriptionOrTitle.value
})

defineOgImage({
  component: 'Docs',
  title: page.value.title,
  description: descriptionOrTitle.value
})

const headline = computed(() => findPageHeadline(page.value))

const links = computed(() => [toc?.bottom?.edit && {
  icon: 'i-heroicons-pencil-square',
  label: 'Edit this page',
  to: `${toc.bottom.edit}/${page?.value?._file}`,
  target: '_blank',
}, ...(toc?.bottom?.links || [])].filter(Boolean))

const getCrumbs = () => {
  const array = route.path.split('/');

  let i = 1;
  const final = []
  while (i < array.length) {
    final.push({
		label: array[i],
		to: `/${array.slice(1,i+1).join('/').toString()}`
	})
    i++;
  }
  return final
}

</script>

<template>
  <UPage>
    <!-- <UPageHeader :title="page.title" :description="page.description" :links="page.links" :headline="headline" /> -->
    <UBreadcrumb v-if="getCrumbs().length > 1" class="app-breadcrumbs mt-8" :links="getCrumbs()" />
    <UPageBody prose>
      <template v-if="page.body">
        <ContentRenderer :value="page" />
        <hr v-if="surround?.length">
        <UDocsSurround :surround="surround" />
      </template>
      <template v-else>
        <CommonForFolders :path="route.path" />
      </template>
    </UPageBody>

    <template v-if="page.toc !== false" #right>
      <UDocsToc :title="toc?.title" :links="page.body?.toc?.links">
        <template v-if="toc?.bottom" #bottom>
          <div class="hidden lg:block space-y-6" :class="{ '!mt-6': page.body?.toc?.links?.length }">
            <UDivider v-if="page.body?.toc?.links?.length" type="dashed" />

            <UPageLinks :title="toc.bottom.title" :links="links" />
          </div>
        </template>
      </UDocsToc>
    </template>
  </UPage>
</template>
<style>
.app-breadcrumbs a span {
	text-transform: capitalize;
}
</style>
