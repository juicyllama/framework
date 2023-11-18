# DTOs

Common DTOs used throughout the framework.

## Date

### DateRangeDto

A DTO for a date range.

```typescript
import { DateRangeDto } from '@juicyllama/utils'

class DateRangeDto {
	from: Date
	to: Date
}
```

## Responses

### ErrorResponseDto

A DTO for an error response.

```typescript
import { ErrorResponseDto } from '@juicyllama/utils'

class ErrorResponseDto {
	statusCode: number
	error: string
	message: string[]
}
```

### StatsResponseDto

A DTO for a stats response.

```typescript
import { StatsResponseDto } from '@juicyllama/utils'

class StatsResponseDto {
	count?: number
	avg?: number
	sum?: number
}
```

### SuccessResponseDto

A DTO for a success response.

```typescript
import { SuccessResponseDto } from '@juicyllama/utils'

class SuccessResponseDto {
	success: boolean
}
```

### ProcessedResponseDto

A DTO for a processed response.

```typescript
import { ProcessedResponseDto } from '@juicyllama/utils'

class ProcessedResponseDto {
	created: number
	updated: number
	deleted: number
}
```
