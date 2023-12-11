---
title: Form
---

# JLForm

This component renders a form with configurable fields that allow to create/edit data objects.

## Props

This component accepts the following props:

-   `options` - The table options, see [FormSchema](/frontend/core/types/form) for more information.

## Button on form

For using buttons on the form you need to create a new field with `field: FormFieldField.BUTTON` and property `button` filled in with the following config:

```js
buttons: [
            {
                type: FormFieldButtonType.SUBMIT,
            },
        ],
```

## Emits

This component emits:

-   `submitted-form`, when the form is submitted

## Styles

::alert{type="info"}
These are [Tailwind CSS](https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply) @Apply classes, you can override them in your own CSS file.
::

## Examples

```vue
<script setup lang="ts">
import { JLForm } from '@juicyllama/frontend-core'
import type {
	FormField,
	FormFieldButtonType,
	FormFieldField,
	FormFieldType,
} from '@juicyllama/frontend-core'

const form: FormField[] = reactive([])

const options = {
	type: 'edit',
	name: 'account',
	fields: form,
}

const loaded = ref<boolean>(false)

async function submittedForm(form) {
	// API call
}
</script>

<template>
	<JLForm :options="options" v-if="loaded" @submitted-form="submittedForm"></JLForm>
</template>
```
