---
title: Upload
---

# JLUpload

## Props

-   `allowedFileType` - file type to accept, currently supports 'CSV' or 'JSON'
-   `endpoint` - URL where data will be sent by POST

## Example

```vue
<script lang="ts" setup>
import { JLUpload } from '@juicyllama/frontend-core'
</script>

<template>
	<JLUpload :allowedFileType="'CSV'" :endpoint="'/upload'"> Upload CSV</JLUpload>
</template>
```
