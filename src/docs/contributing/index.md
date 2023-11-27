---
title: "Contributing to Harlequin"
menuOrder: 2000
---

Thanks for your interest in Harlequin! Harlequin is primarily maintained by [Ted Conbeer](https://tedconbeer.com), but he welcomes all contributions and is looking for additional maintainers!

## Providing Feedback

We'd love to hear from you! [Start a Discussion](https://github.com/tconbeer/harlequin/discussions) or [open an Issue](https://github.com/tconbeer/harlequin/issues/new) to request new features, report bugs, or say hello.

## Contributing Code

If you would like to contribute code to Harlequin, that is fantastic! We would love to support you. Please reach out by opening or commenting on an Issue so we can provide more tactical guidance. If you'd like to create a database adapter for Harlequin, the [next page](adapter-guide) provides a guide.

General advice is below:

### Opening PRs

1. PRs should be motivated by an open issue. If there isn't already an issue describing the feature or bug, [open one](https://github.com/tconbeer/harlequin/issues/new). Do this before you write code, so you don't waste time on something that won't get merged.
2. Ideally new features and bug fixes would be tested, to prevent future regressions. Textual provides a test harness that we use to test features of Harlequin. You can find some examples in the `tests` directory of this project. Please include a test in your PR, but if you can't figure it out, open a PR to ask for help.
3. Open a PR from your fork to the `main` branch of `tconbeer/harlequin`. In the PR description, link to the open issue, and then write a few sentences about **why** you wrote the code you did: explain your design, etc.
4. Ted may ask you to make changes, or he may make them for you. Don't take this the wrong way -- he values your contributions, but he knows this isn't your job, either, so if it's faster for him, he may push a commit to your branch or create a new branch from your commits.

### Setting up Your Dev Environment and Running Tests

1. Install [Poetry](https://python-poetry.org/) v1.2 or higher if you don't have it already. You may also want to install `make`.
1. Fork this repo, and then clone the fork into a directory (let's call it `harlequin`), then `cd harlequin`.
1. Use `poetry install --sync` to install the project (editable) and its dependencies (including all test and dev dependencies) into a new virtual env.
1. Use `poetry shell` to spawn a subshell with the virtual environment activated.
1. Run `pre-commit install` to install pre-commit hooks.
1. Type `make` to run all tests and linters, or run `pytest`, `black .`, `ruff . --fix`, and `mypy` individually.
