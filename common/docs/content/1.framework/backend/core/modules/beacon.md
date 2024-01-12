---
title: Beacon
---

## Overview

The beacon module allows you to notify users in a multitude of different ways, including:

-   Email
-   SMS
-   Instant Messaging
-   Push Notifications
-   In-app Notifications
-   Webhooks

::alert{type="danger"}
This module is currently in development and is limited to Email, SMS, PUSHER right now.
::

::alert{type="info"}
The beacon service is used by a number of other modules also to keep frontend applications in sync with the backend automatically.
::

The beacon module also integrated directly into other modules when installed. See below for a [full list of possible integrations](#integrations).

::alert{type="info"}
Pass a unique string as part of your request to avoid duplicate notifications being sent. The system will check for this unique key before sending a notification.
::

## Usage

Import the module into your application:

```typescript
//app.module.ts
import { forwardRef, Module } from '@nestjs/common'
import { BeaconModule } from '@juicyllama/core'

@Module({
	imports: [forwardRef(() => BeaconModule)],
})
export class AppModule {}
```

Inject the service into your classes:

```typescript
//example.service.ts
import { BeaconService } from '@juicyllama/core'

@Injectable()
export class ExampleService {
	constructor(@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService) {}
}
```

Send notifications using the service:

```typescript
//example.service.ts

await this.beaconService.notify(options)
```

## Methods

The following methods are available:

### Notify

The main method for sending notifications, this method takes a single options object as a parameter which can be used to configure which types of notifications to send and their contents.

```typescript
await this.beaconService.notify({})
```

## Examples

### Send an email

```typescript

```

### Send a push notification

```typescript

```

### Send a In-app notification

```typescript

```

### Send an IM

```typescript
await this.beaconService.notify({
	methods: {
		im: true,
	},
	communication: {
		im: {
			slack: {
				channel: `example_channel`,
			},
		},
	},
	markdown: `⚠️ The cat is on fire! ⚠️`,
	unique: `cat_fire_${Dates.format(new Date(), 'YYYY_MM_DD')}`, //limit this type of alert to daily
})
```

## Integrations

The beacon module can integrate with the following modules:

| Method | Modules                         |
| ------ | ------------------------------- |
| Email  | [app-aws]()                     |
| SMS    | [app-aws]()                     |
| Push   | [app-pusher]()                  |
| IM     | [app-slack](../../../apps/slack/0.index.md) |


## Templates

The framework ships with very basic messages which you can enable by adding the relevent entry to your `.env` file.

### Custom Templates

However we recommend adding your own custom templates.

To setup your custom templates, you can add the following files: 

- email.md
- 

Before the template is sent, we automatically convert `${values}` from the injected object details below.

Once you have added the above templates to your project, you can then add the reference in your `.env` file, for example:

```
BEACON_ACCOUNT_CREATE="lib/common/beacons/accounts/create"
```

The system will then look for the above template files in that folder, if it does not find the file, it will revert to the frameworks default. 

### Template Hooks

Add the hook to your .env file pointing to your template directory

| Hook | Injected Object                    |
| ------ | ------------------------------- |
| `BEACON_ACCOUNT_CREATE`  | `{ account: Account, owner: User, hrefs: {	dashboard: String } }` |
| `BEACON_ACCOUNT_ADMIN_TEMPORARY_PASSWORD`    |  `{ owner: User, password: String, hrefs: { reset: String } }` |
| `BEACON_USER_INVITED`  | `{ account: Account, user: User, hrefs: {	reset: String } }` |
| `BEACON_USER_ADDED`  | `{ account: Account, user: User, hrefs: { login: String } }` |
| `BEACON_USER_AUTH_VERIFICATION_CODE`  | `{ user: User, code: String, { hrefs: { cta: String } }` |
| `BEACON_USER_AUTH_PASSWORDLESS_CODE`  | `{ user: User, code: String, { hrefs: { cta: String } }` |
| `BEACON_BILLING_WITHDRAWAL_REQUEST`  | `{ withdrawal: Withdrawal, user: User, amount: Intl.NumberFormat }` |
| `BEACON_BILLING_PAYMENT_RECEIVED`  | `{ payment: Payment, user: User, amount: Intl.NumberFormat }` |
| `BEACON_BILLING_PAYMENT_DECLINED`  | `{ payment_method: PaymentMethod, user: User, amount: Intl.NumberFormat }` |
| `BEACON_BILLING_PAYMENT_METHOD_EXPIRY`  | `{ payment_method: PaymentMethod}` |