# BaseEntity

You can extend your entities with this class to add some common fields.

## Usage

```typescript
import { BaseEntity } from '@juicyllama/core'

@Entity()
export class Example extends BaseEntity {
	@Column()
	name: string

	constructor(partial: Partial<Example>) {
		super()
		Object.assign(this, partial)
	}
}
```

## Fields

The following fields are available on all entities that extend this class.

| Field      | Type | Description                          |
| ---------- | ---- | ------------------------------------ |
| created_at | Date | The date the entity was created      |
| updated_at | Date | The date the entity was last updated |
| deleted_at | Date | The date the entity was deleted      |
