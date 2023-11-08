# App Store

We have pre-built an app store type interface to make it easier for you to allow your users to add their own apps to their accounts.

::: warning
This frontend implementation requires the backend to be setup and running, [you can learn more about this here](../../../../backend/app-store/README.md).
:::

::: danger
Create video overview with 
:::



## Apps Component



## Oauth > Start

To facilitate the ability for apps to be added to 3rd party app stores you will need to add a new route to your app.

::: warning
This route should be placed behind user authentication
:::

Add the following to your `router/routes.ts` file:

```typescript
import { JLOauthStart } from '@juicyllama/frontend-core'

//Add into the relevent array

{
	path: '/oauth/start',
	name: 'Oauth',
	component: JLOauthStart,
}
```