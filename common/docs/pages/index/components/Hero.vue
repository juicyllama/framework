<template>
	<div class="relative z-[1] text-center">
		<div class="mb-10">
			<span type="button"
				class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 text-xs gap-x-1.5 px-2.5 py-1.5 ring-1 ring-inset ring-current text-primary-500 dark:text-primary-400 disabled:bg-transparent dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center font-semibold hover:bg-primary-100 dark:hover:bg-primary-900 rounded-full">
				Currently In Beta
			</span>
		</div>
		<h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl"> Rapid Development<br><span
				class="text-primary block lg:inline-block">Framework</span></h1>


		<p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300"> <a
				href="https://juicyllama.com" rel="noopener noreferrer" target="_blank">JuicyLlama </a> pride ourselves on delivering rapid development projects for our clients,<br /> we do this in part via our open-source modular development framework. </p>
		<div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">
			<a type="button"
				class="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-base gap-x-2.5 px-3.5 py-2.5 shadow-sm text-white dark:text-gray-900 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 inline-flex items-center"
				href="/docs/getting-started/installation">
				<Icon name="i-ph:rocket-launch-duotone" class="flex-shrink-0 h-6 w-6" /> Get Started
			</a>
			<button type="button"
				class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-base gap-x-2.5 px-3.5 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center">
				<Icon name="i-ph:video-duotone" class="flex-shrink-0 h-6 w-6" /> What is Nuxt?
			</button>
		</div>

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

For example, if you want to build a SaaS API backend, you will likely need [@juicyllama/core](./backend/core/README.md) and `@juicyllama/billing` to get started.

::alert{type="danger"}
@juicyllama/billing needs documenting
::


We leverage:

-   [NestJS](https://nestjs.com/) for building APIs and backend applications
-   [Vue](https://vuejs.org), [Quasar](https://quasar.dev/) and [Tailwindcss](https://tailwindcss.com/) for building frontend cross-platform applications

We also have a number of utility / development modules that helps speed up development and provide additional functionality. 

	</div>

</template>


