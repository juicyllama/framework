<script setup>
import { WidgetsComponent } from '@juicyllama/frontend-core'

const staticWidgetsdata = {
  "data": [
    {
      "content": "JLChart",
      "name": "buildFormData",
      "size": "MEDIUM",
      "description": "buildFormData",
      "page": "buildFormData",
      "configs": "",
      "id": "3c4d7dba-2eb3-4388-9b22-2aaf442a0432",
      "order": 0
    },
    {
      "content": "JLStats",
      "name": "2",
      "size": "MEDIUM",
      "description": "2",
      "page": "buildFormData",
      "configs": "",
      "id": "c14ae57b-0e2b-4ff8-9ee0-927190d56c81",
      "order": 0
    }
  ]
}
</script>

<template>
  <WidgetsComponent :data="staticWidgetsdata"></WidgetsComponent>
  <WidgetsComponent editable :endpoint="'/test'"></WidgetsComponent>
</template>
