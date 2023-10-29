# Getting Started

The shortlinks tool allows you to host a simple URL shortener on your own domain.

For example, you can offer your users the ability to turn their long URL's into shorter ones, e.g.

[http://usersblogdomain.com/blog/category/post-name-here/](#) could become [http://short.url/1234ABCD](#)

This is helpful for users who want to share their content on social media, or in sms messages. As a side benefit it also helps you track how many people are visiting the links.

For advanced reporting you can link the shortlink stats back to your local entity resources (details below).

## Install

Follow these instructions to use the shortlinks tool in your project.

### Package

Install the package into your project:

```bash
pnpm install @juicyllama/tools-shortlinks
```

### Environment Variables

Add the following environment variables to your project:

```bash
# The url for your shortlink redirects
BASE_URL_SHORTLINKS=https://redirect.url 
# The url to redirect users to if they use an invalid shortlink code
BASE_URL_SHORTLINKS_INVALID=https://redirect.url

```

### Api Backend

Import the module into your application:

```typescript
//app.module.ts
import { ShortlinksModule } from '@juicyllama/tools-shortlinks'

@Module({
	imports: [
		forwardRef(() => ShortlinksModule),
	],
})
```

Add the documentation helper into your swagger config

```typescript
//main.ts
import { installToolsShortlinkDocs } from '@juicyllama/tools-shortlinks'

//place this below the swagger setup
redoc = installToolsShortlinkDocs(redoc)
```


### Miscroservice

To allow the redirects to work, you will need to add a new Microservice. This will then need to be hosted online and connected to your redirection URL.

1. Add the microservice to your NestJS application json config

```json5
// nest-cli.json

{
    "projects": {
        "shortlinks": {
            "type": "application",
            "root": "apps/shortlinks",
            "entryFile": "main",
            "sourceRoot": "apps/shortlinks/src",
            "compilerOptions": {
                "plugins": ["@nestjs/swagger/plugin"],
                "assets": ["**/*.html", "**/*.ico", "**/*.png", "**/*.json"],
                "watchAssets": true,
                "tsConfigPath": "apps/shortlinks/tsconfig.app.json"
            }
        }
    }
}

```

2. Add the microservices main.ts file

```typescript
// apps/shortlinks/src/main.ts

import { NestFactory } from '@nestjs/core'
import 'module-alias/register'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.startAllMicroservices()
}
bootstrap()
```

3. Add the module to your new microservice

```typescript
// apps/shortlinks/src/app.module.ts
import { forwardRef, Module } from '@nestjs/common'
import { ShortlinksModule } from '@juicyllama/tools-shortlinks'
import { AppController } from './app.controller'

@Module({
    imports: [forwardRef(() => ShortlinksModule)],
	controllers: [AppController],
})
export class AppModule {}
```

4. Add the controller to your new microservice

```typescript
// apps/shortlinks/src/app.controller.ts

import { Controller, forwardRef, Get, Inject, Param, Req, Res } from '@nestjs/common'
import { ShortlinksService } from '@juicyllama/tools-shortlinks'

@Controller()
export class AppController {
	constructor(
		@Inject(forwardRef(() => ShortlinksService)) private readonly service: ShortlinksService,
	) {}

	@Get()
	async root(@Req() req, @Res() res) {
		return res.redirect(process.env.BASE_URL_SHORTLINKS_INVALID)
	}

	@Get(':code')
	async redirect(@Req() req, @Res() res, @Param('code') code: string) {
		const url = await this.service.redirect(req, code)
		if(!url) return res.redirect(process.env.BASE_URL_SHORTLINKS_INVALID)
		return res.redirect(url.long_url)
	}
}
```

### Hosting

Once you have the microservice setup, you will need to host it online. Follow your standard CI / CD pipeline to host the additional microservice.
