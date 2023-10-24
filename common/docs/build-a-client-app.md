## Build a client application

In this tutorial we explain how to quickly and easily deploy a client appplication with minimal code, yet tons of functionality. The client application will include:

- Backend API 
- Frontend Interface

### Starter template

We have built a starter repo you can use for quickly launching a client application using our framework.

::: warning
If you have not already [installed our framework](/#installation), we recommend doing that first. This will ensure your system is setup and ready for working on client projects.
:::

Once you have installed the framework, you can now install the client quickstart project

```bash
git clone git@github.com:juicyllama/client-quickstart.git
cd client-quickstart
pnpm run install:client
```

You can then open up two terminal windows to start both the `backend` and `frontend` applications.

```bash
cd backend 
pnpm run start:dev
```

Visit [https://local.api.qs.juicyllama.com](https://local.api.qs.juicyllama.com) to ensure the backend has fired up, you should see the API documentation for this client application. 

```bash
cd frontend
pnpm run start:dev
```

The vite server should automatically open up the frontend in your browser, if not, you can access the frontend with this url: [https://local.app.qs.juicyllama.com:8080/](https://local.app.qs.juicyllama.com:8080/)


### Creating an Account / User

The quickest way to get an account & user setup on the system is to create a new account using [this endpoint](https://local.api.qs.juicyllama.com/#tag/Account/operation/AccountController_create).

Using postman the request would look like this:

```curl
curl --location 'https://local.api.qs.juicyllama.com/account' \
--header 'Content-Type: application/json' \
--data-raw '{
    "account_name": "Example",
    "owners_email": "example@example.com",
    "owners_password": "E$@mp7&Own3er",
    "owners_first_name": "Example",
    "owners_last_name": "Owner"
}'
```

Once created, you can go ahead and login via the frontend interface.

### Installing Backend Packages

We have a wide range of pre-built backend packages to speed up your development for general usecases. For example, would you like to support an [App Store](/backend/app-store/) or [Billing](/backend/billing/) or perhaps a [CRM](/backend/crm/). 

These modules are simply plug and play and will extend the core application. With just a few lines of code, you can harness the power of our framework.

### Adding Apps

We have a range of pre-built apps ready to install and use out of the box. If an app is missing then why not create one using one of the existing apps as a template. Or you can [open a discussion here](https://github.com/juicyllama/framework/discussions) to see if others would benefit from the app. 

### Adding custom modules

Due to our abstracted [Crud](/backend/core/decorators/crud.html), [Controller](/backend/core/helpers/controller.html) and [Service](/backend/core/helpers/service.html) helpers, adding new modules and CRUD endpoints is very easy.

An example custom module can be seen in `/backend/src/modules/animals`

You can checkout the API documentation for the [animals endpoint here](https://local.api.qs.juicyllama.com/).

### Wrap up

You now have the foundations of a scalable API driven application, common usecases have likley been implemented via one of our packages, apps or utils.

We are always happy to support developers who want to learn and grow within our framework, if you have questions, you can [drop them here](https://github.com/juicyllama/framework/discussions).

If you would like deeper support, [contact the studio](https://juicyllama.com/contact), we are more than happy to discuss your unique requirements and see how our team can help support you.