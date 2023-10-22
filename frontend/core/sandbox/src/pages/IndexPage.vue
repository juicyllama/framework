<script lang="ts" setup>
import { JLLogin } from '../../../src';
</script>

<template>
  <q-layout view="lHh Lpr fff">
    <q-page class="window-height row justify-center items-center">
      <div class="column q-pa-lg">
        <div class="row">
          <q-card square class="auth-card">
            <q-card-section class="bg-primary"></q-card-section>
            <q-card-section>
              <JLLogin></JLLogin>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </q-layout>
</template>

<style scoped></style>
