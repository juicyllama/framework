# Enums

Common Enums used throughout the framework.

## Cache

### CachePeriod

```typescript
import { CachePeriod } from '@juicyllama/utils'

enum CachePeriod {
	NEVER = 0,
	MINUTE = 60,
	TWENTY = 1200,
	HOUR = 3600,
	DAY = 86400,
	WEEK = 604800,
	MONTH = 2419200,
	YEAR = 31535965,
}
```

## Currencies

### SupportedCurrencies

```typescript
import { SupportedCurrencies } from '@juicyllama/utils'

enum SupportedCurrencies {
	AUD = 'AUD',
	CAD = 'CAD',
	CHF = 'CHF',
	EUR = 'EUR',
	GBP = 'GBP',
	INR = 'INR',
	MXN = 'MXN',
	USD = 'USD',
	JPY = 'JPY',
	CNY = 'CNY',
	HKD = 'HKD',
	NZD = 'NZD',
	SEK = 'SEK',
	KRW = 'KRW',
	SGD = 'SGD',
	NOK = 'NOK',
	RUB = 'RUB',
	ZAR = 'ZAR',
	TRY = 'TRY',
	BRL = 'BRL',
}
```

## Dates

### SubscriptionFrequency

```typescript
import { SubscriptionFrequency } from '@juicyllama/utils'

enum SubscriptionFrequency {
	DAILY = 1,
	WEEKLY = 7,
	BIWEEKLY = 14,
	MONTHLY = 30,
	BIMONTHLY = 60,
	QUARTERLY = 90,
	BIQUARTERLY = 180,
	YEARLY = 365,
}
```

## Env

### Enviroment

```typescript
import { Enviroment } from '@juicyllama/utils'

enum Enviroment {
	production = 'production',
	sandbox = 'sandbox',
	development = 'development',
	test = 'test',
}
```

## Languages

### SupportedLanguages

```typescript
import { SupportedLanguages } from '@juicyllama/utils'

enum SupportedLanguages {
	ENGLISH = 'en',
}
```

## Stats

### StatsMethods

```typescript
import { StatsMethods } from '@juicyllama/utils'

enum StatsMethods {
	COUNT = 'COUNT',
	SUM = 'SUM',
	AVG = 'AVG',
}
```

### StepType

```typescript
import { StepType } from '@juicyllama/utils'

enum StepType {
	HOURS = 'HOURS',
	DAYS = 'DAYS',
	WEEKS = 'WEEKS',
	MONHTHS = 'MONTHS',
	YEARS = 'YEARS',
}
```
