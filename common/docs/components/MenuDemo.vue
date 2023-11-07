<script setup>
import { JLDropdownButtonMenu } from '@juicyllama/frontend-core'

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

<template>
  Flat menu:<JLDropdownButtonMenu :button="button" :menu="menuFlat"/>
  <br>
  <br>
  2-level menu: <JLDropdownButtonMenu :button="buttonRed" :menu="menu"/>

</template>
