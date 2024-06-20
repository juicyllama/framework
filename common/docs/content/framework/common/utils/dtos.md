# DTOs

Common DTOs used throughout the framework.

## Date

### DateRangeDto

A DTO for a date range.

```ts
import { DateRangeDto } from '@juicyllama/utils'

class DateRangeDto {
	from: Date
	to: Date
}
```

## Responses

### ErrorResponseDto

A DTO for an error response.

```ts
import { ErrorResponseDto } from '@juicyllama/utils'

class ErrorResponseDto {
	statusCode: number
	error: string
	message: string[]
}
```

### StatsResponseDto

A DTO for a stats response.

```ts
import { StatsResponseDto } from '@juicyllama/utils'

class StatsResponseDto {
	count?: number
	avg?: number
	sum?: number
}
```

### SuccessResponseDto

A DTO for a success response.

```ts
import { SuccessResponseDto } from '@juicyllama/utils'

class SuccessResponseDto {
	success: boolean
}
```

### ProcessedResponseDto

A DTO for a processed response.

```ts
import { ProcessedResponseDto } from '@juicyllama/utils'

class ProcessedResponseDto {
	created: number
	updated: number
	deleted: number
}
```
