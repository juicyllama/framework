# Getting Started

The Slack app is a way of sending messages via Slack.

::: tip
If you are looking for alerting functionality, check out [Beacons](/backend/core/modules/beacon.html). You can send Slack messages (and much more) via Beacons.
:::

## Install

Follow these instructions to use the Slack app directly in your project.

### Package

Install the package into your project:

```bash
pnpm install @juicyllama/app-slack
```

### Slack App

You will need to setup and install your slack app, full instructions here: [https://slack.dev/bolt-js/tutorial/getting-started](https://slack.dev/bolt-js/tutorial/getting-started)

### Environment Variables

Once setup, add the following environment variables to your project:

```bash
SLACK_SIGNING_SECRET=your_signing_secret
SLACK_BOT_TOKEN=xoxb-your_bot_token
```

### Modules

Import the module into your project:

```typescript
import { SlackModule } from '@juicyllama/app-slack'

@Module({
  imports: [forwardRef(() => SlackModule)],
})
```

### Services

Once imported you can inject the service into your application, you can find a list of [services / methods here](/apps/slack/methods).
