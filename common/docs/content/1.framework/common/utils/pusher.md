---
title: Pusher
---

# Pusher

JL components like [JLTable](../../frontend/core/components/2.common/table.md) genereally have 2 ways to retrieve and send data - API calls and web-socket based service [Pusher](https://pusher.com/){:target="_blank"}.
More dev docs on how to work with Pusher can be found on [Pusher dev portal](https://pusher.com/docs/channels/using_channels/client-api-overview/?ref=docs-index){:target="_blank"}.

## Usage

To use Pusher you need to set up the account credentials in related `.env` file:

```
PUSHER_CHANNEL=XXX
PUSHER_KEY=YYY
```

If Pusher is set up properly you can verify it by enabling [logging](../../common/utils/utils.md) severity to `LogSeverity.VERBOSE` and you should receive `Pusher listening for events` message in browser console
