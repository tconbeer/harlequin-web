---
title: "Contributing to Harlequin"
menuOrder: 2000
---

Thanks for your interest in Harlequin! Harlequin is primarily maintained by [Ted Conbeer](https://tedconbeer.com), but he welcomes all contributions!

## Sponsoring Harlequin

Please consider [sponsoring Ted](https://github.com/sponsors/tconbeer), so he can continue to dedicate time to developing and supporting Harlequin.

## Providing Feedback

We'd love to hear from you! [Start a Discussion](https://github.com/tconbeer/harlequin/discussions) or [open an Issue](https://github.com/tconbeer/harlequin/issues/new) to request new features, report bugs, or say hello.

## Contributing Code

If you would like to contribute code to Harlequin, that is fantastic! Ted would love to support you. Please reach out by opening or commenting on an Issue so we can provide more tactical guidance. If you'd like to create a database adapter for Harlequin, the [next page](adapter-guide) provides a guide.

**Watch this video** for an overview of the end-to-end process for contributing to Harlequin, from clone to PR:

<div style="position: relative; padding-bottom: 56.25%; height: 0;">
    <iframe title="Video: Contributing to Harlequin" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="https://www.tella.tv/video/cls3nmne700000gl4bcp91arr/embed?b=0&title=1&a=1&loop=0&t=0&muted=0" allowfullscreen allowtransparency>
    </iframe>
</div>

General advice is below:

### Opening PRs

1. PRs should be motivated by an open issue. If there isn't already an issue describing the feature or bug, [open one](https://github.com/tconbeer/harlequin/issues/new). Do this before you write code, so you don't waste time on something that won't get merged.
2. Ideally new features and bug fixes would be tested, to prevent future regressions. Textual provides a test harness that we use to test features of Harlequin. You can find some examples in the `tests` directory of this project. Please include a test in your PR, but if you can't figure it out, open a PR to ask for help.
3. Please include an entry in CHANGELOG.md that explains the change and links to the open issue that this change closes. Feel free to credit yourself as a contributor.
4. Open a PR from your fork to the `main` branch of `tconbeer/harlequin`. In the PR description, link to the open issue, and then write a few sentences about **why** you wrote the code you did: explain your design, etc.
5. Ted may ask you to make changes, or he may make them for you. Don't take this the wrong way -- he values your contributions, but he knows this isn't your job, either, so if it's faster for him, he may push a commit to your branch or create a new branch from your commits.

### Setting up Your Dev Environment and Running Tests

1. Install [Poetry](https://python-poetry.org/) v1.2 or higher if you don't have it already. You may also want to install `make`.
1. Fork this repo, and then clone the fork into a directory (let's call it `harlequin`), then `cd harlequin`.
1. Use `poetry install --sync` to install the project (editable) and its dependencies (including all test and dev dependencies) into a new virtual env.
1. Use `poetry shell` to spawn a subshell with the virtual environment activated.
1. Run `pre-commit install` to install pre-commit hooks.
1. Type `make` to run all tests and linters, or run `pytest`, `black .`, `ruff . --fix`, and `mypy` individually.

### Inspecting and Updating Snapshot Tests

Many changes to Harlequin will cause snapshot tests to fail. You will need to inspect the failures and update the "ground truth" snapshots in order for tests to pass (see the video for more info). The steps are:

1. Run `pytest` to generate test failures. If snapshots do not match, a file called `snapshot_report.html` will be generated in the root of the project directory.
2. Open `snapshot_report.html` in a browser and inspect the before and after for each failing snapshot. The "Show Difference" toggle is especially handy to quickly find the change that caused the failure. Note: sometimes invisible changes (like changes to class names in the SVG) can cause test failures. In this case, after toggling "Show Difference", you should see a blank, black square.
3. If all of the new snapshots are showing the expected result, run `pytest --snapshot-update`, and confirm the result of that command.
4. Check in any changes to the data files in the `tests/functional_tests/__snapshots__` directory.
5. Including a screenshot of any changes in your PR description is much appreciated!
