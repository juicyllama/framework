# Cron Helper

A set of helpers for cron jobs.

## CronRunner

This method takes the domain (for logging) and function you wish to run and executes it. It will log the start and end of the function, as well as any errors that occur.

The output includes the result from the cron and the time taken to execute.

````typescript
import { CronRunner } from '@juicyllama/core'

const result = await CronRunner('my-domain', async () => {
  // Do something
})
````