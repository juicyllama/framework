---
title: Common
---

## API

### FindOptions

The find options for API lookups.

```typescript
import type { FindOptions } from '@juicyllama/quasar'
```

| Property | Type       | Description                |
|----------|------------|----------------------------|
| `limit`  | `[number]` | The limit for the find     |
| `offset` | `[number]` | The offset for the find    |
| `order_by` | `[string]` | The order by for the find  |
| `order_by_type` | `[enum]` | Either `ASC` or `DESC`     |
| `select` | `[string]` | The entity items to select |
| `search` | `[string]` | The search for the find    |
| `relations` | `[string]` | The relations to include   |

## Buttons

### Custom Button

The custom button object.

```typescript
import type { CustomButton } from '@juicyllama/quasar'
```

| Property | Type       | Description                                                                                                                                                                                      |
|----------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`    | `[string]` | The key for the button                                                                                                                                                                           |
| `label`  | `[string]` | The label for the button                                                                                                                                                                         |
| `icon`   | `[string]` | The icon for the button                                                                                                                                                                          |
| `action` | `[Function]` | The function to run when the button is clicked, it will output the following to the function <br/><br/> ```{data: formData, q: $q, schema: TableSchema \| FormSchema, button: CustomButton } ``` |

## Icons

### Icon Settings

Sets the default icon settings for the application.

```typescript
import type { IconSettings } from '@juicyllama/quasar'
```

| Property | Type       | Description                                          |
|----------|------------|------------------------------------------------------|
| `type`   | `[string]` | The icon set type                                    |
| `icons` | `[object]` | The [icon actions](#icon-actions) for common actions |

#### Icon Actions

| Property | Type       | Description                            |
|----------|------------|----------------------------------------|
| `add`    | `[string]` | The icon for the add action            |
| `edit`   | `[string]` | The icon for the edit action           |
| `delete` | `[string]` | The icon for the delete action         |
| `search` | `[string]` | The icon for the search action         |
| `columns` | `[string]` | The icon for the columns action        |
