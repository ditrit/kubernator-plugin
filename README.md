# Kubernator-plugin

Plugin for managing Kubernetes files in [Leto-Modelizer](https://github.com/ditrit/leto-modelizer).

## Default commands

Usage explanation of scripts in `package.json`.

### build

Build the application in `dist` folder.

### lint

Run eslint to check on the project.

### lint:fix

Run eslint to fix on the project.

### lint:report

Generate issues report with eslint for sonar.

### test

Run all the unit tests.

### test:coverage

Run all the unit tests and generate coverage report of the unit tests for sonar.

### generate:parser

Generate lidy parser for your grammar. It uses `src/lidy/k8s.yml` as grammar.

Every time you modify the grammar, you need to launch this script to generate the parser.
It will generate a `src/lidy/k8s.js`.

Lidy is not perfect, so you have to modify the import in the `src/lidy/k8s.js` to make it work.
Modify import with this value:
```js
import { parse as parse_input } from 'lidy-js';
```

## Development

### How to release

We use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as guideline for the version management.

Steps to release:
- Create a new branch labeled `release/vX.Y.Z` from the latest `main`.
- Improve the version number in `package.json`, `package-lock.json` and `changelog.md`.
- Verify the content of the `changelog.md`.
- Commit the modifications with the label `Release version X.Y.Z`.
- Create a pull request on github for this branch into `main`.
- Once the pull request validated and merged, tag the `main` branch with `vX.Y.Z`
- After the tag is pushed, make the release on the tag in GitHub

### Git: Default branch

The default branch is main. Direct commit on it is forbidden. The only way to update the application is through pull request.

Release tag are only done on the `main` branch.

### Git: Branch naming policy

`[BRANCH_TYPE]/[BRANCH_NAME]`

* `BRANCH_TYPE` is a prefix to describe the purpose of the branch. Accepted prefixes are:
  * `feature`, used for feature development
  * `bugfix`, used for bug fix
  * `improvement`, used for refacto
  * `library`, used for updating library
  * `prerelease`, used for preparing the branch for the release
  * `release`, used for releasing project
  * `hotfix`, used for applying a hotfix on main
* `BRANCH_NAME` is managed by this regex: `[a-z0-9._-]` (`_` is used as space character).
