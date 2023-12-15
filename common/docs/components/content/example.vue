<template>
	<UCard :ui="ui" />
	<div class="p-2 border bg-white dark:bg-black dark:border-gray-700 rounded">
		dfghjklkjhgfd
	</div>

	<div class="row">
	<div class="col-4">
	<q-list bordered separator>
      <q-item clickable v-ripple>
        <q-item-section>Single line item</q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Item with caption</q-item-label>
          <q-item-label caption>Caption</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label overline>OVERLINE</q-item-label>
          <q-item-label>Item with caption</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
</div>
	<div class="col-8 row">

		<q-card class="my-card col-6 col-md-4" flat bordered v-for="i in 10">
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Overline</div>
          <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
          <div class="text-caption text-grey">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat>
          7:30PM
        </q-btn>
        <q-btn flat color="primary">
          Reserve
        </q-btn>
      </q-card-actions>
    </q-card>
	</div>
</div>
  </template>

  <script setup>
  const ui = /*ui*/ {
	background: 'bg-white dark:bg-slate-900'
  }
  </script>
