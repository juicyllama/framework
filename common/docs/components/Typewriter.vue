<script setup>
import VueWriter from "vue-writer";

const props = defineProps(['words'])

</script>

<template>
    <h1>HELLOS!!!</h1>
    <ClientOnly>
        <VueWriter :array="['testing', 'this', 'help']" />
    </ClientOnly>
</template>
