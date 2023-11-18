## FormSchema

The form schema object.

| Property | Type        | Description                                           |
| -------- | ----------- | ----------------------------------------------------- |
| `name`   | `string`    | The name of the form                                  |
| `type`   | `string`    | Action of the form - create new or edit existing data |
| `fields` | `FormField` | List of fields                                        |

## FormField

The form field object.

| Property      | Type             | Description                                                         |
| ------------- | ---------------- | ------------------------------------------------------------------- |
| `key`         | `string`         | The unique key of the field                                         |
| `label`       | `string`         | Textual label for a field                                           |
| `disabled`    | `boolean`        | Flag if field is editable                                           |
| `placeholder` | `string`         | Text displayed when field value is empty                            |
| `hint`        | `string`         | Textual hint for a field                                            |
| `required`    | `boolean`        | Flag that inidcates is the field value required or not              |
| `loading`     | `boolean`        | Flag displaying a loading state for a field in case of dynamic data |
| `value`       | `any`            | Contains starting value, in case of editing existing data           |
| `field`       | `FormFieldField` | Type of the field                                                   |
| `type`        | `FormFieldType`  | Type of an a native `input` field to be displayed                   |
| `buttons`     | `array`          | Special case for displaying control buttons, like 'Submit'          |
| `settings`    | `any`            | Further extension of field behaviour                                |

## FormFieldField

Types of fields that are available to be used on the form:

```js
;(INPUT = 'input'),
	(DROPDOWN = 'dropdown'),
	(BUTTON = 'button'),
	(TOGGLE = 'toggle'),
	(DATE = 'date'),
	(TAGS = 'tags'),
	(PLUGIN = 'plugin') //used for custom plugins
```

## FormFieldType

Available values

```js
text
password
number
email
```
