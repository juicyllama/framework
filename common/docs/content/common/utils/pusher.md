---
title: Pusher
---

# Pusher

JL components like [JLTable](/frontend/core/components/common/table) genereally have 2 ways to retrieve and send data - API calls and web-socket based service [Pusher](https://pusher.com/).
More dev docs on how to work with Pusher can be found on [Pusher dev portal](https://pusher.com/docs/channels/using_channels/client-api-overview/?ref=docs-index).

## Usage

To use Pusher you need to set up the account credentials in related `.env` file:

```env
PUSHER_CHANNEL=XXX
PUSHER_KEY=YYY
```

If Pusher is set up properly you can verify it by enabling [logging](/common/utils/utils.md#logger) severity to `LogSeverity.VERBOSE` and you should receive `Pusher listening for events` message in browser console
