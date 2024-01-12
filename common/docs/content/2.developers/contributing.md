# Contributing

We really appreciate your interest in contributing to our project. Our framework is used in many commercial projects and so it's important you follow the contributing guidelines closely.

## Help Wanted

We welcome Developers, Project Managers, QA'ers, Documentors, Marketers and anyone else who wants to contribute to our open source framework. 

::alert{type="info"}
If you have not contributed to an open soure project before, [checkout this helpful guide](https://opensource.guide/how-to-contribute/).
::

### Open Source Development

If you are looking to work on existing tickets, then follow this flow:

1. Checkout the [Framework Roadmap Board](https://github.com/orgs/juicyllama/projects/8) for open tickets which need work. 
2. Filter tickets by [help wanted](https://github.com/orgs/juicyllama/projects/8/views/1?filterQuery=label%3A%22help+wanted%22) to see the items which are ready to be picked up.
3. Tickets in the `Todo` column are fully scoped and ready to work on, any tickets in the `No Status` column likley need more scoping. 
4. Once you have a ticket you would like to work on, follow the [contributing flow](#contributing-flow) below.


### Specific Features

If you have specific features, apps, tools or support you want to build into the framework, follow this flow:

1. Discuss the change you wish to make via a [discussion here](https://github.com/juicyllama/framework/discussions).<br><br>
2. Assuming the discussion results in a development task, a member of the core team will create a project task on the [Framework Roadmap Board](https://github.com/orgs/juicyllama/projects/8), along with an issue in the repository.<br><br>
3. Once the ticket is fully scoped out, follow the [contributing flow](#contributing-flow) below.

### Contributing Flow 

1. Install the framework locally by first [folking the framework](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) into your github account.
2. Follow the [installation instructions here](../1.framework/0.index.md#installation) by cloning your folked version of the framework.
2. Branch off `main` and include your `issue number` along with the `task description` e.g. `feature/123-my-new-feature`. We use the following prefixes:
    - `feature/` for new features
    - `bug/` for bug fixes
    - `refactor/` for general refactoring
    - `docs/` for documentation changes
    - `test/` for test changes
    - `misc/` for other changes<br><br>
4. Write your code follow the [Code Style Guide](./code-style-guide) and commit your changes to your branch.<br><br>
5. Ensure you have written tests for your changes and that they pass.<br><br>
6. If you have added a new feature (or updated an existing one), please update this [documentation](#documentation) to reflect the changes.<br><br>
7. Once complete initiate a pull request from your folked version to the framework. This will trigger a review process and automated tests. If the tests fail, please fix the issues and push the changes to your branch. The tests will automatically re-run.<br><br>
8. Once a member of the core team has reviewed your contribution, changes maybe requested, once approved it will be merged into `main` and the issue will be closed.<br><br>

## Code

Please follow the [Code Style Guide](./code-style-guide) when contributing.

## Testing

All contributions should include tests. Contributions without full test coverage will not be accepted.

## Documentation

It's important that our developer documentation is kept upto date. Should you add a new feature (or updated an existing one), please ensure the documentation is updated to reflect the changes.

Our documentation portal is built using [Nuxt](https://nuxt.com/) with the [Docus](https://docus.dev/) theme. You can commit your documentation changes at the same time as your code changes.
