# Getting Started

::: danger
Documentation Todo:
- Widgets (@shershen08)
- Components (Use API as template)
- Helpers (Use Table as template)
- Plugin > Pusher
- Stores (Use Account as template)
- Types (Use Table as template)
  :::

::: tip
Our frontend framework is built on top of [Quasar](https://quasar.dev) and [Vue](https://vuejs.org) frameworks. If you are not familiar with Vue or Quasar, we recommend you read their documentation first.
:::

## Installation

If you are installing the framework for a new project we recommend using the [JuicyLlama CLI](https://github.com/juicyllama-npm/cli). Follow instructions for [installing the CLI](/cli#installation) first, then run:

```bash
JL install
```

Follow the prompts to install the framework and any modules you need.

Alternatively you can install the modules individually via [NPM](https://www.npmjs.com/package/@juicyllama/frontend-core):

```bash
pnpm install @juicyllama/frontend-core
```

## Widgets

Widget system consists of two component modes:

1. Editor for editing existing grid and aging removing components onto it
2. Display widgets - for static displaying components from earlier created layouts.

Both represented by generic `WidgetsComponent` that can accept set of props.

### Widgets editing/creation component

To use editor you need to import `WidgetsComponent` from `@juicyllama/frontend-core` and pass a prop `:editable="true"` or just `editable`

Default sizing of widgets can be as follows:

- Small (3/12 on desktop / 6/12 mobile)
- Medium (6/12 on desktop / 12/12 mobile)
- Large (12/12 on desktop / 12/12 mobile)

Each widget contains following fields:

- Title, client name for widget
- Desciption, client description for widget
- Content (enum) - JLTable / JLForm / JLStats / JLChart / etc
- Page to display a widget
- Size (enum)

Order of placing a widget and size of a widget (S/M/L) can be edited in a visual editor.

### Widgets display component

To use you need to import `WidgetsComponent` from `@juicyllama/frontend-core` and set value of source for widgets data.

## Styling

::: TODO

## Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
&nbsp; ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
&nbsp; ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
&nbsp; ![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
&nbsp; ![Quasar](https://img.shields.io/badge/Quasar-1976D2?logo=quasar&logoColor=fff&style=for-the-badge)
&nbsp; ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
&nbsp; ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=fff&style=for-the-badge)
&nbsp; ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff&style=for-the-badge)
&nbsp; ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff&style=for-the-badge)
&nbsp; ![Bugsnag](https://img.shields.io/badge/Bugsnag-4949E4?logo=bugsnag&logoColor=fff&style=for-the-badge)
&nbsp; ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
