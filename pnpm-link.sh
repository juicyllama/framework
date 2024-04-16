#!/bin/bash

## INSTALL PACKAGES##

### COMMON ###
pnpm link --global --dir common/cli
pnpm link --global --dir common/dev
pnpm link --global --dir common/utils

### FRONTEND ###
pnpm link --global --dir frontend/core
pnpm link --global --dir frontend/vue-dev
pnpm link --global --dir frontend/vue-utils
pnpm link --global --dir frontend/vue-flags

### BACKEND ###
pnpm link --global --dir backend/core
pnpm link --global --dir backend/crm
pnpm link --global --dir backend/app-store
pnpm link --global --dir backend/ai
pnpm link --global --dir backend/billing
pnpm link --global --dir backend/data-cache
pnpm link --global --dir backend/websites
pnpm link --global --dir backend/ecommerce
pnpm link --global --dir backend/social

### APPS ###
pnpm link --global --dir apps/ahrefs
pnpm link --global --dir apps/amazonseller
pnpm link --global --dir apps/apilayer
pnpm link --global --dir apps/aws
pnpm link --global --dir apps/everflow
pnpm link --global --dir apps/google
pnpm link --global --dir apps/mailchimp
pnpm link --global --dir apps/mollie
pnpm link --global --dir apps/openai
pnpm link --global --dir apps/pexels
pnpm link --global --dir apps/scrapingbee
pnpm link --global --dir apps/semrush
pnpm link --global --dir apps/shipbob
pnpm link --global --dir apps/shopify
pnpm link --global --dir apps/slack
pnpm link --global --dir apps/spyfu
pnpm link --global --dir apps/wise
pnpm link --global --dir apps/wordpress
pnpm link --global --dir apps/xero-cc

# NestJS DI
pnpm link --global --dir node_modules/@nestjs/core
pnpm link --global --dir node_modules/@nestjs/typeorm
pnpm link --global --dir node_modules/typeorm
pnpm link --global --dir node_modules/class-validator
pnpm link --global --dir node_modules/@nestjs/common
pnpm link --global --dir node_modules/@nestjs/config
pnpm link --global --dir node_modules/@nestjs/platform-express
pnpm link --global --dir node_modules/@nestjs/microservices
pnpm link --global --dir node_modules/@nestjs/serve-static
pnpm link --global --dir node_modules/@nestjs/swagger