# Getting Started

The openAi app is a nestjs wrapper around [Openai](https://openai.com). It provides a consistent interface for interacting with OpenAi within the confines of our framework.

::: tip
Checkout the OpenAi [documentation](https://platform.openai.com/docs/introduction) for more information.
:::

## Install

Follow these instructions to use the OpenAi wrapper in your project.

### Package

Install the package into your project:

```bash
npm install @juicyllama/app-openai
```

### Environment Variables

Add the following environment variables to your project:

```bash
OPENAI_API_KEY=your_api_key
```

### Methods

Checkout what methods you can use [here](/apps/openai/methods).

::: tip
You can also use the frameworks [AI module](/backend/ai) to interact with the OpenAi app. This offers a layer of abstraction over the app and allows you to easily switch between AI engines. It also performs caching, feedback and other useful features.
:::