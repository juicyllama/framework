---
title: Table
---

# JLTable

This component renders a fully functional table with pagination, sorting, filtering, and more.

::alert{type="info"}
This component uses pusher (if enabled on your backend application) to keep the frontend in sync with the backend, without the user needing to reload the page.
::

## Props

This component accepts the following props:

-   `options` - The table options, see [TableSchema](/frontend/core/types/table) for more information.
-   `visibleColumns` - Array of strings that enlists the collumns that will be visible

## Emits

This component does not emit any events.

## Styles

::alert{type="info"}
These are [Tailwind CSS](https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply) @Apply classes, you can override them in your own CSS file.
::

The following classes are available for styling:

| Class                       | Description                             |
| --------------------------- | --------------------------------------- |
| `jl-table`                  | The wrapper for the table               |
| `jl-table-table`            | The table itself                        |
| `jl-table-top-left`         | The top left section of the table       |
| `jl-table-top-right`        | The top right section of the table      |
| `jl-table-title`            | The title of the table                  |
| `jl-table-loading-no-data`  | The loading state when there is no data |
| `jl-table-loading-skeleton` | The loading state when there is data    |
| `jl-table-row-col-visible`  | The visible column in the row           |
| `jl-table-row-col-hide`     | The hidden column in the row            |
| `jl-table-row-col-value`    | The value of the column in the row      |
| `jl-table-actions`          | The actions section of the table        |
| `jl-table-add-record`       | The add record button                   |
| `jl-table-add`              | The add button                          |
| `jl-table-edit`             | The edit button                         |
| `jl-table-add-edit-card`    | The add/edit card                       |
| `jl-table-form-wrapper`     | The form wrapper                        |

## Examples

```vue
<script setup lang="ts">
import { JLTable } from '@juicyllama/frontend-core'
import type { TableSchema, TableColumn } from '@juicyllama/frontend-core'

const options = {
	title: 'Users',
	name: 'Users',
	event: `users_list`, // if using Pusher
	endpoint: `/users`, // if using REST API
	find: [],
	functions: [],
	schema: [
		{
			required: true,
			label: 'User #',
			align: 'left',
			name: 'user_id',
			field: 'user_id',
			sortable: true,
			show: true,
			primary_key: true,
		},
	],
}

const visibleColumns = ['user_id']
</script>

<template>
	<JLTable :options="options" :visibleColumns="visibleColumns" />
</template>
```
