# OAuth

`GoogleAnalyticsOAuthModule` module is imported by the GoogleAnalyticsModule and exposes endpoints
to process the oAuth2 authorization

- `GET /oauth/init?installed_app_id=X` returns the url to google consent window
- `GET /oauth/callback?code=xxx&state=yyy` callback url full version of which needs to be configured as accepted callback url in the Google Cloud app
