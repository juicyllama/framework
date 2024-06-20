# Oauth

Typically the Oauth process can be kicked off in a few different ways:

1. From the App Store Frontend Component
2. Directly from a 3rd party App Stores
3. Via an API call

#### App Store Component

This is a pre-build GUI you can use in your project to simplify the ability for users to add apps. This wraps around 3. via an API call and handles this on your behalf.

::alert{type="danger"}
We need to document the app store frontend component
::

[You can learn more about it here](../../frontend/core/components/0.app-store.md)

#### 3rd Party

Some apps may start the Oauth flow from 3rd party app stores, in such cases we would need to authenticate the user before handing off to the install flow.

#### API Call

::Incomplete

You can see the endpoint details here.

## OAuth2 Flow

### Start

To start a new Oauth flow, you can send a new backend request to:

`${BASE_URL_API}/oauth/start?integration_name=${integration_name}`

This will kick off a new Oauth process for whichever app you specify.

This is a great entry point for 3rd party app stores as you don't need to pass anything other than the `integration_name`

The endpoint will authenticate the user between the backend and the frontend and handoff to the [install step](#install)

::alert{type="danger"}
We need to document the frontend work
::

::alert{type="warning"}
Note: you will need to ensure the route is configured in your frontend app, [you can learn more about it here](#)
::

### Install

If you have already authenticated the user (for example via your frontend app), you can simply fire a POST request to the app store to install a new app.

The endpoint URL is `${BASE_URL_API}/apps/installed`

This endpoint expects the `body` to include the install app details, you can see all of the details required in your API documentation once you have installed the App Store documentation into your backend application.

### Redirects

Each app which supported Oauth2 will be configured to redirect to the 3rd party API in order to handle the communication between the two systems, this will be built into the app module.

If you are looking to create app's for the system, you can take a look at an existing OAUTH2 app to see how it works. You will also need to update the `App Store` to support the relevent redirects on install.
