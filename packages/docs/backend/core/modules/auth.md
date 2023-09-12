---
title: Auth
---

# Auth

The auth module contains all the functionality required to authentication users, including SSO.

## Usage

Import the module into your application:

```typescript
//app.module.ts
import { forwardRef, Module } from '@nestjs/common'
import { AuthModule } from '@juicyllama/core'

@Module({
  imports: [
	  forwardRef(() => AuthModule),
  ],
})
export class AppModule {}
```

Out of the box, this will add all the authentication endpoints to your application.

## Single Sign On (SSO)

The application supports SSO via the following providers:

| Provider              |
|-----------------------|
| [Google](#google-sso) | 


### Google SSO

1. Create a new project in the [Google Cloud Console](https://console.cloud.google.com/)<br><br>
2. Set up the [Oauth consent screen](https://console.cloud.google.com/apis/credentials/consent)<br><br>
3. Add the following scopes: 
   * `.../auth/userinfo.email`
   * `.../auth/userinfo.profile`<br><br>
4. Create a new [OAuth 2.0 Client ID](https://console.cloud.google.com/apis/credentials/oauthclient)<br><br>
5. Add your Javascript origins e.g. `https://api.<your-domain>` for your backend API application<br><br>
6. Add the frontend redirect URI (must point to the login page) e.g. `https://app.<your-domain>/login` for the frontend application<br><br>
7. Follow the [verification process](https://console.cloud.google.com/apis/credentials/consent/edit;verificationMode=true) to make the app public if you need to<br><br>
8. Add the following environment variables to your application:<br>
```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
9. To show the Google SSO button on the frontend, add the following environment variables to your frontend application:<br>
```bash
VITE_SSO_GOOGLE=true
```

::: tip
For customizing how the Google SSO button looks, see the [Frontend Auth Docs](/frontend/quasar/components/auth/login.md)
:::


