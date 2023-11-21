# Getting Started

The Shopify app is a nestjs wrapper around the [Shopify Development Ecosystem](https://shopify.dev/). It provides a consistent interface for interacting with Shopify within the confines of our framework.

::alert{type="info"}
Checkout the Shopify [documentation](https://shopify.dev/docs/api) for more information.
::

### App Store

In order to save the clients auth tokens, this package extends [app store](/backend/app-store/readme).

It will automatically install the shopify app into the app store database when you include it in your project.

### Integration

#### Connecting to Shopify

There are two ways to integrate with Shopify:

#### Access Token

If your use case does not require a fully published app into the Shopify App store and instead you already have access to the Admin API Access Token, e.g. your application only requires access to one store. You can pass this optional value when creating an installed app inside the `app-store`.

By default this option is hidden inside the app settings object, you can update this from `hidden: true` to `hidden: false`. This will allow your users to add this data via the frontend.

The key for this option is `SHOPIFY_ADMIN_API_ACCESS_KEY` you can add to any `installed_app`. The system will prioritise this local key over system wide settings.

#### Shopify App Ecosystem

This app can sit on top of the Shopify App Ecosystem, so you may first create an App in the [Shopify Partner Account](https://www.shopify.com/partners), here you can also setup a demo store.

::alert{type="warning"}
This module uses OAuth to connect to shopify stores, to faciliate this we use a cookie to pass the state throught the OAuth flow.

You should make sure the `cookie-parser` package is configured on your project (in your main.ts file)

```
import cookieParser from 'cookie-parser'
app.use(cookieParser());
```

::

##### Environment Variables

Once your app is created, you will be given the following credentials:

```bash
SHOPIFY_APP_CLIENT_ID=
SHOPIFY_APP_CLIENT_SECRET=
```

##### Shopify App Setup

You should add the following URL's to your Shopify app:

App URL:
`${BASE_URL_API}/oauth/start?integration_name=shopify`

Allowed redirection URL(s):
`${BASE_URL_API}/app/shopify/auth/redirect`
`${BASE_URL_API}/app/shopify/auth/complete`

::alert{type="warning"}
Replace `${BASE_URL_API}` with your actual backend URL.
::

##### Extra Oauth Scopes

You can optionally pass in additional scopes if you app has special permissions. An example is that Shopify limits order data to 60 days unless you apply for the `read_all_orders` scope. This needs to be approved by Shopify. If you app is approved for this, you can add that to the `.env` file as follows:

```
SHOPIFY_EXTRA_SCOPES=read_all_orders
```

This will then be added to the default scopes.

##### Redirect after Oauth

You can optionally setup a redirect URL which we will send the user to after the Oauth process commpletes, for example, you could redirect them back to your Shopify App screen or to a page on your dashboard confirming the app setup is complete. Add the following to your `.env` file:

```
SHOPIFY_OAUTH_REDIRECT_URL=https://some.url
```

If this is not provided, we will redirect the user back to the your app's base url `BASE_URL_APP`

### Modules

::alert{type="danger"}

-   Document modules / endpoints
-   Explain how crons work
    ::

### Crons

`CRON_APP_SHOPIFY_SYNC_ORDERS`

### Webhooks

::alert{type="danger"}

-   document supported webhooks
    ::
