<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()

$q.loading.show({
    message: `Starting Oauth Setup...`
})

$q.loading.hide()

</script>
<template>
    <div id="oauth" class="row"></div>
</template>