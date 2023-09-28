# CLI

The CLI is a command line tool to help speed up your local development on JuicyLlama projects.

::: danger
Currently only used to help speed up client project deployment, but we have plans to help build out modules we full command line interaction and much more.
:::

## Cheatsheet

::: danger
The cheatsheet is a work in progress... once done it will be referenced here.
:::

## Installation

Follow these instructions to install the CLI globally on your machine.

### Requirements

Before you install please make sure you have [Brew](https://docs.brew.sh/Installation) installed on your machine.

Ideally you should also install the framework first, please do so now. You can find the instructions [here](/#Installation).

### Prerequisites

Install following packages:

```bash
brew install jq
npm install pnpm -g
pnpm install npx -g
```

Optional dependencies:

```bash
brew install dopplerhq/cli/doppler
```

#### Additional Reading

- [Doppler docs](https://docs.doppler.com/docs/install-cli)

### Clients

To install client projects pull the repo down locally and run the following command:

```bash
npx jl install
```

If this fails, you may not have the framework fully installed and linked. Please follow the [installation instructions](/#Installation) and try again.
