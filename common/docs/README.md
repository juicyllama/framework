---
title: Home
sidebar: false
---

# JuicyLlama Framework

::: danger
Our framework is currently in a beta phase while we work our way to a stable version 1.0.0.
:::

::: danger
Documentation Todo: 
- Core (AS WIP)
- Billing
- CRM
- Lana
- Quasar
- Vue Utils
- Apps
- QR Code (Finish)
:::

[JuicyLlama](https://juicyllama.com) pride ourselves on delivering rapid development projects for our clients, we do this in part via our modular development framework.

::: tip
We are often referred to as an application framework as we bridge the gap between development frameworks like [NestJs](https://nestjs.com/) and [Vue](https://vuejs.org) with the final applications users interact with. If you are not familiar with NestJS or Vue we recommend you read their documentation first.
:::

We work on the `client-back` principle rather than `framework-forward` which means we focus our efforts on building features which are useful to our clients and then package them up into modules for reuse. This allows us to spend maximum time focused on delivering high value features and less time on stuff that may rarely get used.

## Modules

Our framework is modular, you install the modules you need into your projects. This allows you to pick and choose the modules based on the features you want.

For example, if you want to build a SaaS API backend, you will likely need [@juicyllama/core](/backend/core) and [@juicyllama/billing](/backend/billing) to get started.

We leverage: 

* [NestJS](https://nestjs.com/) for building APIs and backend applications
* [Vue](https://vuejs.org) and [Quasar](https://quasar.dev/) for building frontend cross-platform applications

We also have a number of utility / development modules that helps speed up development and provide additional functionality. For example checkout our [CLI](/cli) for local rapid development setup.

## Contributing

Our framework is open source, we welcome contributions from the community. If you have a module you would like to add, please [drop us a message](/support) so we can discuss the best way to integrate it.

If you wish to contribute please read the following guides:

* [Contributing](/developers/contributing)
* [Code Style Guide](/developers/code-style-guide)


## Installation

