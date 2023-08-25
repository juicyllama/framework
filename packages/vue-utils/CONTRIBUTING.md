# Contributing

1. Clone Repo
2. Install dependencies (`npm install`)
3. Create your feature branch (`git checkout -b [JIRA-XX] my-new-feature`)
4. Commit your changes (`git commit -am 'Added some feature'`)
5. Test your changes (`npm test`)
6. Push to the branch (`git push origin [JIRA-XX] my-new-feature`)
7. [Create new Pull Request](https://help.github.com/articles/creating-a-pull-request/)

## Testing

We use [Jest](https://github.com/facebook/jest) to write tests. Run our test suite with this command:

```
npm test
```

## Code Style

We use [Prettier](https://prettier.io/) and @typescript-eslint to maintain code style and best practices.
Please make sure your PR adheres to the guides by running:

```
npm run format
```

and

```
npm run lint
```
