# App Store

We have pre-built an app store type interface to make it easier for you to allow your users to add their own apps to their accounts.

::alert{type="warning"}
This frontend implementation requires the backend to be setup and running, [you can learn more about this here](https://docs.juicyllama.com/framework/backend/core).
::

::alert{type="danger"}
Create video overview with
::

## Apps Component

::alert{type="danger"}
TODO Document this
::

## Oauth > Start

To facilitate the ability for apps to be added to 3rd party app stores you will need to add a new route to your app.

This route is responsable for authenticating the user and kicking off the app integration.

::alert{type="warning"}
This route should be placed behind user authentication
::

Add the following to your `router/routes.ts` file:

```ts
import { JLOauthStart } from '@juicyllama/frontend-core'

// Add into the relevent routes array

{
	path: '/oauth/start/:integration_name',
	name: 'Oauth',
	component: JLOauthStart,
}
```

## Oauth > Finish

::alert{type="danger"}
Document the finishing step (redirect back)
::

```ts
{
	path: '/oauth/shopify',
	name: 'Oauth Shopify',
	component: () => import('../pages/dashboard/oauth/shopify/redirect.vue'),
}
```
