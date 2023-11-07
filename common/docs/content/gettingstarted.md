---
title: Home
sidebar: false
---

# JuicyLlama Framework

[JuicyLlama](https://juicyllama.com) pride ourselves on delivering rapid development projects for our clients, we do this in part via our modular development framework.

::alert{type="danger"}
Our framework is currently in a beta phase while we work our way to a version 1.0.0.

It is being used in many production apps however things are subject to breaking changes.
::

::alert{type="warning"}
Here is a full list of the documentatiom which still needs creating:

https://github.com/orgs/juicyllama/projects/8/views/1?pane=issue&itemId=36729897
::

::alert{type="info"}
We are often referred to as an application framework as we bridge the gap between development frameworks like [NestJs](https://nestjs.com/) and [Vue](https://vuejs.org) with the final applications users interact with. If you are not familiar with NestJS or Vue we recommend you read their documentation first.
::

We work on the `client-back` principle rather than `framework-forward` which means we focus our efforts on building features which are useful to our clients and then package them up into modules for reuse. This allows us to spend maximum time focused on delivering high value features and less time on stuff that may rarely get used.

## Who are JuicyLlama

A small intro video to who we are:


<iframe width="560" height="315" src="https://www.youtube.com/embed/ekqLFttBud4?si=NHw6dF6UP_tyht7x" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Modules

Our framework is modular, you install the modules you need into your projects. This allows you to pick and choose the modules based on the features you want.

For example, if you want to build a SaaS API backend, you will likely need [@juicyllama/core](/backend/core) and [@juicyllama/billing](/backend/billing) to get started.

We leverage:

* [NestJS](https://nestjs.com/) for building APIs and backend applications
* [Vue](https://vuejs.org) and [Quasar](https://quasar.dev/) for building frontend cross-platform applications

We also have a number of utility / development modules that helps speed up development and provide additional functionality. For example checkout our [CLI](/common/cli/readme) for local rapid development setup.

## Contributing

Our framework is open source, we welcome contributions from the community. If you have a module you would like to add, please [drop us a message](/support) so we can discuss the best way to integrate it.

If you wish to contribute please read the following guides:

* [Contributing](/developers/contributing)
* [Code Style Guide](/developers/code-style-guide)


## Installation

Follow these instructions to install the framework for the first time.

### Prerequisites

Before you install please make sure you have [Brew](https://docs.brew.sh/Installation) installed on your machine.

You should also have [Docker](https://docs.docker.com/get-docker/) installed and running on your machine.

Install following packages:

```bash
brew install jq
npm i -g pnpm
pnpm i -g npx
pnpm i -g ts-node
pnpm i -g mkcert
```

Optional dependencies:

##### Doppler

If you want to use doppler for secrets management and sharing:

```bash
brew install dopplerhq/cli/doppler
```

Additional Reading: [Doppler docs](https://docs.doppler.com/docs/install-cli)

### Running the framework

```bash
git clone git@github.com:juicyllama/framework.git
cd framework
pnpm run install:framework
pnpm run start:docker:build
```

### Build a client application

The real power of our framework is seen through the rapid development of client applications.

Checkout the [build a client application](/build-a-client-app) walkthrough to get a solid overview of our framework in action.

As our framework grows, with more applications using it, more apps added and more developers contributing, the value also increases, this network effect is the reason why we have opensourced our work.
