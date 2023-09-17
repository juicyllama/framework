# CLI

The CLI is a command line tool to help speed up your local development on JuicyLlama projects.

It helps automate common tasks such as installing new projects, starting development tasks, logging time spent on projects and more.

Once installed, take a look at the [commands](/cli/commands) for a list of commands you can run.

## Cheatsheet

::: danger
The cheatsheet is a work in progress... once done it will be referenced here.
:::

## Installation

Follow these instructions to install the CLI globally on your machine.

### Requirements

Before you install please make sure you have [Brew](https://docs.brew.sh/Installation) installed on your machine.

### Prerequisites

Using [Brew](https://docs.brew.sh/Installation) install following packages:

- jq: `brew install jq`
- doppler: `brew install dopplerhq/cli/doppler`, more here: [doppler docs](https://docs.doppler.com/docs/install-cli)

If you have not downloaded the framework yet, please do so now. You can find the instructions [here](/#Installation).

Once the framework is installed either run the `pnpm run link` command to link all the packages or if you only want to link the CLI you can do so with `pnpm link --global --dir common/cli` this will enable the `jl` command globally on your machine.
