# Commands

Run these commands from the root of each of your project's directories. If you have multiple projects, e.g. a backend api and a frontend user portal, you will need to run these commands from the root of both projects.

::: tip
You can call `JL` to get a list of all available commands.
:::

## Setup

The following command is used to set-up your local development environment. You only need to run this command once per project.

### Prerequisites

Before running install with JL, make sure you have done following steps:

- docker is installed on your machine and Docker services is running, check with `$ docker -v`
- you're logged into your NPM org, using `npm login`

### Install

```bash
JL install
```

This commands sets up the project for development. It should be run after cloning a project from GitHub. This command does the following:

* Installs the local development secrets from Doppler
* Installs the project dependencies
* Installs the local SSL certificates


## Development

The following commands are used for the development lifecycle of our projects.

::: danger
The following commands are not yet finished, once complete they will be documented here.
:::

### Start

```bash
JL start
```

::: danger
This command is not yet finished, once complete it will be documented here.
:::

This command does the following:

* Starts the correct Docker containers for the project

### Stop

```bash
JL stop
```

::: danger
This command is not yet finished, once complete it will be documented here.
:::

Call this command to stop working on the project.

This command does the following:

* Stops the Docker containers for the project
