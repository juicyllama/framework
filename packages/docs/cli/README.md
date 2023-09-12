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

### Install

````bash
mkdir -p ~/Sites/JuicyLlama/@juicyllama/cli
cd ~/Sites/JuicyLlama/@juicyllama/cli
git clone git@github.com:juicyllama-npm/cli.git .
npm install
````

#### MacOS

1. Get the CLI file location with the following command: `echo $PATH:$(pwd)`
2. Run the following commands:

````bash
cd
touch .zshrc
vim .zshrc
````

3. Add the reference from step 1 to the end of the file and save it. Example:

````bash
#Running JL CLI Globally
export PATH=$PATH:~/Sites/JuicyLlama/@juicyllama/cli
````

#### Windows

::: danger
Instructions needed for Windows and Linux
:::
