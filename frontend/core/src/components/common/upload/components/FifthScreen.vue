<template>
  <q-card-section class="q-pt-none q-pb-none">
    <div class="text-weight-bold">
      We have gathered all information the wizard needs to import your data.
      Click the Start button to begin importing.
    </div>
  </q-card-section>
  <q-card-section>
    <p>
      Table: {{ tablesCount }}/{{ totalTables }}<br />
      Processed: {{ processed }}<br />
      Added: {{ added }}<br />
    </p>
  </q-card-section>
  <q-card-section>
    <q-linear-progress
      dark
      rounded
      indeterminate
      color="secondary"
      class="q-mt-sm"
    />

    <q-banner inline-actions class="text-white bg-red">
      There was an error during the import process. Please try again.
      <br />Error code #SDF4567
    </q-banner>

    <q-banner inline-actions class="text-white bg-green">
      Import file was successfully uploaded.
    </q-banner>
  </q-card-section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const totalTables = ref(1);
const tablesCount = ref(1);
const processed = ref(123);
const added = ref(124);

</script>
