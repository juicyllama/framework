# Getting Started

The app store module allows you to give your users the ability to add app integrations into their projects.

For example, connect their WordPress site to your project and perform actions on their behalf.

::alert{type="warning"}
The app store currently supports the following apps:
- [WordPress](/apps/wordpress)
::

## Install

Follow these instructions to use the app store in your project.

### Package

Install the package into your project:

```bash
pnpm install @juicyllama/app-store
```

### Api Backend

Import the module into your application:

```typescript
//app.module.ts
import { AppsModule } from '@juicyllama/app-store'

@Module({
	imports: [
		forwardRef(() => AppsModule),
	],
})
```

Add the documentation helper into your swagger config

```typescript
//main.ts
import { installAppStoreDocs } from '@juicyllama/app-store'

//place this below the swagger setup
redoc = installAppStoreDocs(redoc)
```

### Parent / Child Apps

Some apps are "whitelabel" or "saas" apps in which other brands use. 

For exmaple, Everflow allows brands to whitelabel their app. This means many apps can be added by use the Everflow integration.

For this we introduced Parent/Child apps, this is a way of you specifing in a App the parent app_id. The system will then revert back to the parent app for integration.