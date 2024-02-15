<script setup>
const props = defineProps(['type'])
const cssClassesMap = {
  info: 'my-2 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3',
  warning: 'my-2 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4',
  error: 'my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative',
}
const cssClass = computed(() => cssClassesMap[props.type])
</script>
<template>
  <div :class="[cssClass, `alert-${props.type}`]" class="app-content-alert-component">
    <ContentSlot :use="$slots.default" unwrap="p" />
  </div>
</template>
