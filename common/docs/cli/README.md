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

Once installed you can then configure the CLI to work on your machine.

### Configuration

#### MacOS

1. Copy the CLI location with the following command: `pnpm root --global`, it will be something like `/Users/{USER}/Library/pnpm/global/5/node_modules`
2. Run the following commands:

````bash
cd
touch .zshrc
vim .zshrc
````

3. Add the reference from step 1 with the cli module appended `@juicyllama/cli` to the end of the file and save it. Example:

````bash
#Running JL CLI Globally
export PATH=$PATH:/Users/{USER}/Library/pnpm/global/5/node_modules/@juicyllama/cli
````

#### Windows

::: danger
Instructions needed for Windows and Linux
:::
