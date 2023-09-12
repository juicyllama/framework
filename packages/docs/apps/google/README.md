# Getting Started

The Google app is a wrapper around different Google APIs. It provides a consistent interface for interacting with the Google within the confines of our framework.

It comes with the added benefit of leveraging a data lake (if you have one setup) to cache the results of your api calls (saving money). Along with logging and other framework standards.

::: tip
Contact us to learn more about our data lake solution.
:::

## Install

Follow these instructions to use the Google wrapper in your project.

### Package

Install the package into your project:

```bash
npm install @juicyllama/app-google
```

### Environment Variables

Add the following environment variables to your project:

```bash
GOOGLE_MAPS_API_KEY=your_api_key
```

### Modules

The package is built as a set of modules, you choose which modules you need to import into your project.