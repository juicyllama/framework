---
title: Table
---

## TableSchema

This component renders a table schema, it is used by the [JLTable](../components/2.common/table.md) component to render the table.

```typescript
import type { TableSchema } from '@juicyllama/frontend-core'
```

| Property    | Type       | Description                                                                               |
| ----------- | ---------- | ----------------------------------------------------------------------------------------- |
| `name`      | `string`   | The name of the table                                                                     |
| `schema`    | `array`    | The array of [TableColumn](#tablecolumn)                                                  |
| `title`     | `[string]` | The title of the table                                                                    |
| `event`     | `[string]` | The event pusher should listen for                                                        |
| `endpoint`  | `[string]` | The endpoint to fetch the data from                                                       |
| `icon`      | `[object]` | The [IconSettings](common.md/#icon-settings) to use for the table |
| `show`      | `[object]` | The [show](#show) object to use for the table                                             |
| `redirects` | `[object]` | The [redirect](#redirects) settings to use for the table                                  |
| `find`      | `[object]` | The [FindOptions](common.md/#findoptions) settings to use for the table                      |
| `functions` | `[object]` | The [Functions](#functions) to use with the actions                                       |

## TableColumn

This is the schema for each table column you want to render.

```typescript
import type { TableColumn } from '@juicyllama/frontend-core'
```

| Property      | Type         | Description                                                                                       |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `field`       | `string`     | The name of the field, should match the entity key                                                |
| `label`       | `string`     | The label to display for the column                                                               |
| `primary_key` | `[boolean]`  | If this is the primary key for the entity                                                         |
| `required`    | `[boolean]`  | If this field is required                                                                         |
| `align`       | `[string]`   | The alignment of the column, can be `left`, `center`, or `right`                                  |
| `sortable`    | `[boolean]`  | If this column is sortable                                                                        |
| `format`      | `[Function]` | The function to format the value in the display                                                   |
| `reformat`    | `[Function]` | Used to reformat on create/edit before sending to server                                          |
| `show`        | `[boolean]`  | If this column should be shown in the table                                                       |
| `form`        | `[object]`   | The [FormField](form.md#formfield) the form element for this entity item |
| `extra`       | `[object]`   | Table [Extra](#extra) options for this column                                                     |

## Show

Control what options are shown/hidden for the table.

| Property         | Type        | Description                                                                             |
| ---------------- | ----------- | --------------------------------------------------------------------------------------- |
| `clickable`      | `[boolean]` | If the row is clickable                                                                 |
| `column_filter`  | `[boolean]` | If the column filter is enabled                                                         |
| `search_filter`  | `[object]`  | If the search filter is enabled, pass the [SearchFilterOptions](#search-filter-options) |
| `add_record`     | `[boolean]` | If the add record button is enabled                                                     |
| `update_inline`  | `[boolean]` | If the inline update is enabled                                                         |
| `update_record`  | `[boolean]` | If the update record icon is added                                                      |
| `delete_record`  | `[boolean]` | If the delete record icon is added                                                      |
| `custom_buttons` | `[array]`   | The array of [TableCustomButton](#table-custom-button) objects                          |

## Redirects

If you would like to redirect to a different route, rather than handling it in the component, you can use the redirects object.

| Property | Type       | Description                                                                                                                                                     |
| -------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `click`  | `[string]` | The route to redirect to when the row is clicked. You can include row params in the url for example: `/edit/:${record_id}/${name.toUpperCase()}/${description}` |
| `add`    | `[string]` | The route to redirect to when the add button is clicked                                                                                                         |
| `edit`   | `[string]` | The route to redirect to when the edit button is clicked. You can include row params in the url for example: `/edit/:${record_id}`                              |
| `delete` | `[string]` | The route to redirect to when the delete button is clicked. You can include row params in the url for example: `/delete/:${record_id}`                          |

## Functions

When actions are performed on the table, you can use the functions object to add custom functionality.

| Property  | Type         | Description                                             |
| --------- | ------------ | ------------------------------------------------------- |
| `create`  | `[Function]` | The function to run when a new record should be created |
| `findOne` | `[Function]` | The function to run when a record should be found       |
| `findAll` | `[Function]` | The function to run when all records should be found    |
| `stats`   | `[Function]` | The function to run when stats should be found          |
| `update`  | `[Function]` | The function to run when a record should be updated     |
| `delete`  | `[Function]` | The function to run when a record should be deleted     |

## Extra

Additional column items specific to the column type:

| Property | Type       | Description     |
| -------- | ---------- | --------------- |
| `type`   | `enum`     | `BADGE`, `HTML` |
| `colors` | `[object]` |                 |

## Table Custom Button

If you would like to add your own custom buttons to the table.

::alert{type="info"}
This extends [CustomButton](common.md#custom-button), so you can use all the same properties as a CustomButton along with these additional properties.
::

| Property   | Type     | Description                                            |
| ---------- | -------- | ------------------------------------------------------ |
| `position` | `[enum]` | `TOP_RIGHT`, `TOP_LEFT`, `BOTTOM_RIGHT`, `BOTTOM_LEFT` |

## Search Filter Options

| Property      | Type       | Description                                            |
| ------------- | ---------- | ------------------------------------------------------ |
| `position`    | `enum`     | `TOP_RIGHT`, `TOP_LEFT`, `BOTTOM_RIGHT`, `BOTTOM_LEFT` |
| `placeholder` | `[string]` | The placeholder text for the search filter             |
