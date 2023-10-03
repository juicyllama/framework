<template>
  <div class="row full-width">
    <q-space />
    <q-btn
      no-caps
      label="Back"
      v-if="backButtonVisible"
      :disable="!props.isBackActive"
      @click="emit('onBackButtonClicked')"
      class="q-mr-lg col-1"
    />
    <q-btn
      no-caps
      color="primary"
      label="Next"
      v-if="nextButtonVisible"
      :disable="!props.isNextActive"
      @click="emit('onNextButtonClicked')"
      class="q-mr-lg col-1"
    />
    <q-btn
      no-caps
      :disable="!props.isStartActive"
      @click="emit('onStartButtonClicked')"
      label="Start"
      class="col-1"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUploaderStore } from '../stores/uploader';
const props = defineProps(['isNextActive', 'isBackActive', 'isStartActive']);
const emit = defineEmits([
  'onNextButtonClicked',
  'onBackButtonClicked',
  'onStartButtonClicked',
]);

const uploader = useUploaderStore();

const backButtonVisible = computed(() => uploader.getStep > 1);
const nextButtonVisible = computed(() => uploader.getStep < 5);
</script>
