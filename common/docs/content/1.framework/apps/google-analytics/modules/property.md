# Property

`GoogleAnalyticsPropertyModule` module is imported by the GoogleAnalyticsModule and exposes endpoint
to runReport

- `POST /property/run-report?installed_app_id=X`

Body accepts anything you would pass into [BetaAnalyticsDataClient.runReport()](https://googleapis.dev/nodejs/analytics-data/latest/index.html)
except `property`, which is pulled from the installed app settings.
