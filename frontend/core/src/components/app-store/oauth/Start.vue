<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { JLAppStoreConnect } from '../index'
import { AppsService, InstalledAppsService, APPS_ENDPOINT } from '../../../services/app-store'
import { logger } from '../../../helpers'
import { LogSeverity, AppStoreIntegrationName, ConnectAppOptionsOverrides } from '../../../types'

const route = useRoute()
const $q = useQuasar()
const integration_name = <string>route.query.integration_name
let message = null

if(!integration_name){
    logger({ severity: LogSeverity.ERROR, message: `Missing param: integration_name `, q: $q })
} else if(!AppStoreIntegrationName[integration_name]){
    logger({ severity: LogSeverity.ERROR, message: `Incorrect integration_name: ${integration_name}`, q: $q })
}

$q.loading.show({
    message: `Starting Oauth Setup...`
})

const overrides: ConnectAppOptionsOverrides[] = []

Object.entries(route.query).forEach(
  ([key, value]) => { if(key !== 'integration_name') overrides.push({ key: key, value: value.toString(), hide: true}) }
)

const app_service = new AppsService()

const app = await app_service.findAll({
    url: APPS_ENDPOINT,
    find: {
        integration_name: integration_name,
    },
})

if(!app || !app.length){
    logger({ severity: LogSeverity.ERROR, message: `Could not find app with integration name ${integration_name}`, q: $q })
} else{

    const installed_app_service = new InstalledAppsService()

    if(route.query.SHOPIFY_SHOP_NAME){
        const preCheck = await installed_app_service.precheck(app[0].app_id, {SHOPIFY_SHOP_NAME: route.query.SHOPIFY_SHOP_NAME})

        if(preCheck.result === false){
            message = preCheck.error
        }
    }
}


$q.loading.hide()



</script>
<template>
    <div id="oauth" class="row">
        <span v-if="message" class="text-h6 text-weight-bold text-center">{{message}}</span>
        <JLAppStoreConnect v-else :integration_name="AppStoreIntegrationName[integration_name]" :icon="{hide: true}" :overrides="overrides"  />
    </div>
</template>