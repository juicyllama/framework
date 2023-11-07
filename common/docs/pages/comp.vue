<template>
    <ClientOnly fallback-tag="span" fallback="Loading client components...">

        <QuasarDemo/>

        <!-- {{ state }}
        <q-btn color="primary" label="Primary" @click="state = !state"/>
        <QBtn color="secondary" label="Secondary" />
        <LazyQBtn color="amber" glossy label="Amber" />
        <br> -->
        <JLUpload :allowedFileType="'CSV'" endpoint="/api/upload"> Upload CSV</JLUpload>
    <JLUpload :allowedFileType="'JSON'" endpoint="/api/upload/json"> Upload JSON</JLUpload>
    <br>
    <br>
    Flat menu:<JLDropdownButtonMenu :button="button" :menu="menuFlat"/>
    <br>
    <br>
    2-level menu: <JLDropdownButtonMenu :button="buttonRed" :menu="menu"/>

    <StatsDemo/>
    </ClientOnly>
</template>
<script setup>
import { JLUpload, JLDropdownButtonMenu } from '@juicyllama/frontend-core'
import QuasarDemo from '../components/QuasarDemo.vue'
import StatsDemo from '../components/StatsDemo.vue'

import { ref } from 'vue'
const state = ref(false)


const buttonRed = {
  color: 'red',
  label: 'Click me',
}

const button = {
  label: 'Click me',
}

const menuFlat = {
  items: [
    {
        caption: 'Item caption',
        title: 'Item title',
        link: '/foo/1'
      },
      {
        caption: 'Item 2 caption',
        title: 'Item 2 title',
        link: '/foo/2',
      },
  ]
}

const menu = {
    items: [
      {
        caption: 'Item caption',
        title: 'Item title',
        link: '/foo/1'
      },
      {
        caption: 'Item 2 caption',
        title: 'Item 2 title',
        link: '/foo/2',
        icon: 'warning'
      },
      {
        caption: 'Submenu',
        title: 'Submenu title',
        links: [{
          caption: 'Item 3',
          title: 'Item 3',
          link: '/foo/3'
        }]
      }
      ]
  }
</script>
