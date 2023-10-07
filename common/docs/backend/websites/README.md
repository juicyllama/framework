# Getting Started

The websites module is a prebuild module for all things related to internet websites, this will evolve over time and should save you time if you want to interact with website entities in your own project.

## Install

Follow these instructions to use the websites module in your project.

### Package

Install the package into your project:

```bash
pnpm install @juicyllama/websites
```

### Api Backend

Import the module into your application:

```typescript
//app.module.ts
import { WesbitesModule } from '@juicyllama/websites'

@Module({
	imports: [
		forwardRef(() => WesbitesModule),
	],
})
```

### API Documentation

You can expose the API documentation for websites as follows

```typescript
//main.ts
import { installWebsiteDocs } from '@juicyllama/websites'

//place this below the swagger setup
redoc = installWebsiteDocs(redoc)
```