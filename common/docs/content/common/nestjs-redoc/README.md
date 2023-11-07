# NestJs Redoc

::alert{type="danger"}
This documenation needs moving to /backend/core/utils/redoc
::

This is the documentation for the JuicyLlama NestJs Redoc package.

::alert{type="warning"}
This package works with Express and is not currently supporting Fastify
::

## Install

Install the package into your project:

```bash
pnpm install @juicyllama/core
```

## Usage

1. Setup the main `DocumentBuilder`in your application root (normally `main.ts`):

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { RedocModule, RedocOptions } from '@juicyllama/core'

const swagger_document = new DocumentBuilder()
  .setTitle('Look, i have a title')
  .setDescription('A very nice description')
  .setVersion(process.env.npm_package_version)
  .setBasePath('/api/v1')
  .build();
const document = SwaggerModule.createDocument(app, options);

const redocOptions: RedocOptions = {
  title: 'Hello Nest',
  logo: {
    url: 'https://redocly.github.io/redoc/petstore-logo.png',
    backgroundColor: '#F0F0F0',
    altText: 'PetStore logo'
  },
  sortPropsAlphabetically: true,
  hideDownloadButton: false,
  hideHostname: false,
  tagGroups: [
    {
      name: 'Core resources',
      tags: ['cats'],
    },
  ],
};

await RedocModule.setup('/docs', app, document, redocOptions);
```

#### Redoc Options

[Click here for a full list of the redoc options you can pass.](/common/nestjs-redoc/options)


2. Controllers

You can specify inside your controller that a `tag` should be added by putting the `@ApiTags('cats')` above the `@Controller`

```typescript
import { ApiTags } from '@nestjs/swagger'

@ApiTags('cats')
@Controller('cats')
```

3. Abstracted Decorators

As part of the JuicyLllama [core](/backend/core/readme) package we have made available a number of abstracted decorators to handle the most common CRUD operations.

- [CRUD Decorators](/backend/core/decorators/crud)
- [Swagger Decorators](/backend/core/decorators/swagger)


## Example Project

If you are just getting started, we recommend setting up our quickstart client project. This will get you up and running quickly adopting framework best practise.

1. [Install the framework](/#installation)
2. [Install the quickstart project](https://github.com/juicyllama/client-quickstart)
