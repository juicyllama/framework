# Getting Started

::alert{type="danger"}
Documentation Todo:
- Modules
- Utils
::

::alert{type="info"}
Our backend framework is built on top of the [NestJS](https://nestjs.com/) framework, if you are not familiar with NestJs we recommend you read their documentation first.
::

## Installation

If you are installing the framework for a new project we recommend using the [JuicyLlama CLI](https://github.com/juicyllama-npm/cli). Follow instructions for [installing the CLI](/common/cli/readme#installation) first, then run:

```bash
JL install
```

Follow the prompts to install the framework and any modules you need.

Alternatively you can install the modules individually via [NPM](https://www.npmjs.com/package/@juicyllama/core):

```bash
pnpm install @juicyllama/core
```

## Config .env variables

Most of the basic ones will be set up using CLI, but for using specific authentication types you'll need to provide ones from Authentication section

### Basic settings

```
  process.env.BASE_URL_API
  process.env.PROJECT_NAME
  process.env.SYSTEM_EMAIL_ADDRESS
  process.env.SYSTEM_EMAIL_NAME
```

### Notifications

```
process.env.PUSHER_APP_ID
process.env.PUSHER_APP_KEY
process.env.PUSHER_APP_SECRET
process.env.PUSHER_APP_CLUSTER
process.env.PUSHER_USE_TLS
process.env.PUSHER_CHANNEL
```

### DB and cache

```
process.env.MYSQL_HOSTNAME
process.env.MYSQL_PORT
process.env.MYSQL_USERNAME
process.env.MYSQL_PASSWORD
process.env.MYSQL_DB_NAME
process.env.RABBIT_MQ_URI
```

### Authentication

```
process.env.AZURE_AD_CLIENT_ID
process.env.AZURE_AD_TENANT_ID

process.env.JWT_KEY

process.env.GOOGLE_CLIENT_ID
process.env.GOOGLE_CLIENT_SECRET

process.env.MICROSOFT_APP_ID
process.env.MICROSOFT_APP_SECRET
process.env.MICROSOFT_AUTHORIZATION_URL
process.env.MICROSOFT_TOKEN_URL
```
