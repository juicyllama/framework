# Usage

## Endpoints

Once you have [installed](/tools/shortlinks#install) the shortlinks package, two new endpoint will be available in your project.

Documentation will also be added to your project for full details on each endpoint.

### Create Shortlink

`POST /tools/shortlinks`

### Update Shortlink

`PATCH /tools/shortlinks/{shortlink_id}`

## Redirects

Once a shortlink has been created, and the redirection [microservice](/tools/shortlinks#miscroservice) has been deployed, you can use the shortlink in your project.

If a valid code is used, it will redirect the user to the url specified in the shortlink.

Should an invalid shortlink be used, it will redirect to the url specified in the `BASE_URL_SHORTLINKS_INVALID` environment variable.

## Stats

The shortlinks package also tracks clicks each time they are used. This can be used to track the popularity of each shortlink.

You can link these clicks back to your other resources by adding the `resource_id` and `resource_type` to the shortlink.

You will then need to add a [subscriber](#subscriber) to create your own customer logic for each click.

## Subscriber

You can create a subscriber to listed to new records on the `tools_shortlink_clicks` table.

In this example, the project is sending SMS messages and turning links into shortlinks. We want to create a `click` entry in our projects `sms_stats`, linking the click from the shortlink to the actual SMS message.

```typescript
//sms.subscriber.ts

import { EventSubscriber, EntitySubscriberInterface, InsertEvent, DataSource } from 'typeorm'
import { Shortlink, ShortlinkClick } from '@juicyllama/tools-shortlinks'
import { Logger } from '@juicyllama/utils'
import { SmsClick } from './sms.entity'

const logger = new Logger()

@EventSubscriber()
export class SmsSubscriber implements EntitySubscriberInterface<ShortlinkClick> {

    constructor(dataSource: DataSource) {
		try {
			dataSource.subscribers.push(this)
			logger.verbose(`SmsSubscriber: Registered`)
		} catch (e: any) {
			logger.warn(`SmsSubscriber Failed: ${e.message}`, e)
		}
	}

	listenTo() {
		return ShortlinkClick
	}

	async afterInsert(event: InsertEvent<any>) {
		const domain = 'sms::SmsSubscriber::afterInsert'

		const shortlink = await event.manager.getRepository(Shortlink).findOne({
			where: {
				shortlink_id: event.entity.shortlink_id,
			}
		})

        if (!shortlink) {
            logger.warn(`[${domain}] No shortlink found for click`, event.entity)
            return
        }

        switch(shortlink.resource_type) {
            case 'SMS':

                const newSmsClick = {
                    sms_id: shortlink.resource_id,
                    clicked: true,
                }

                logger.log(`[${domain}] Creating Sms Click`, newSmsClick)
                return await event.manager.getRepository(SmsClick).save(newSmsClick)

            default:
                logger.error(`[${domain}] Resource type not recognised for shortlink`, shortlink)
                return
        }
	}

}

```

::: warning
Remember to add the subscriber to your `*.module.ts` file
:::
