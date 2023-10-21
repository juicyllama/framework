---
title: Upload
---

# JLUpload

## Props

- `allowedFileType` - file type to accept, currently supports 'CSV' or 'JSON'

## Example

```vue
<script lang="ts" setup>
import { JLUpload } from '@juicyllama/frontend-core'
</script>

<template>
    <JLUpload :allowedFileType="'CSV'"> Upload CSV</JLUpload>
</template>
```
