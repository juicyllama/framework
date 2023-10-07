# Getting Started

The Shopify app is a nestjs wrapper around the [Shopify Development Ecosystem](https://shopify.dev/). It provides a consistent interface for interacting with Shopify within the confines of our framework.

::: tip
Checkout the Shopify [documentation](https://shopify.dev/docs/api) for more information.
:::

### Integration

This app sits on top of the Shopify App Ecosystem, so you should first create an App in the [Shopify Partner Account](https://www.shopify.com/partners), here you can also setup a demo store.

::: warning
This module uses OAuth to connect to shopify stores, to faciliate this we use a cookie to pass the state throught the OAuth flow.

You should make sure the `cookie-parser` package is configured on your project (in your main.ts file)

```
import cookieParser from 'cookie-parser'
app.use(cookieParser());
```
:::

#### Environment Variables

Once your app is created, you will be given the following credentials:

```bash
SHOPIFY_APP_CLIENT_ID=
SHOPIFY_APP_CLIENT_SECRET=
```

#### Shopify App Setup

You should add the following URL's to your Shopify app:

App URL: `${BASE_URL}/app/shopify/auth/install`
Allowed redirection URL(s): 
`${BASE_URL}/app/shopify/auth/redirect`
`${BASE_URL}/app/shopify/auth/complete`

::: warning
Replace `${BASE_URL}` with your actual backend URL.
:::

#### App Store

In order to save the clients auth tokens, this package extends [app store](/backend/app-store).

It will automatically install the shopify app into the app store database when you include it in your project.

### Modules


::: danger
- Document modules / endpoints
- Explain how crons work
:::

### Webhooks

::: danger
- document supported webhooks
:::
