# Glean Development Guide

*This is a work in progress!*

## Updating the `metric.yaml` file

Currently, the source of truth for the shared `metrics.yaml` file lives [here](https://gist.github.com/kirill-demtchouk/41a38336b61b938833fe011bda4a2001) as a gist in Kirill's account. We need to figure out a better solution for this long-term but for the sake of getting everyone up to speed on where we are currently.

When this file has been updated, Kirill will notify us and we need to make changes to update it. Here's my current process:

1. Copy the raw JSON of Kirill's `metrics.yaml` [gist](https://gist.github.com/kirill-demtchouk/41a38336b61b938833fe011bda4a2001)
2. Paste that raw JSON in the `metrics.yaml` file here in elk, replacing everything that was there before
3. Check git diff to make sure I understand what is changing between the previous version and this one
4. Add back the things that the shared `metrics.yaml` file removes
  4a. Specifically, this is the `lifetime: application` and the `no_lint: -baseline` declarations
    - Without adding the `no_lint: - baseline`, the `build:glean` script will fail
    - The `lifetime: application` is needed to make these identifiers show up with every ping
5. Remove the extra things in the shared `metrics.yaml` file that aren't specific to web
  5a. Specifically, remove `fxa_account_id`, `adjust_device_id` in the `identifiers` category and the entire `backend` category
6. Make sure that all the new additions and removals from the shared `metrics.yaml` file are included here in elk
7. Run the `build:glean` script
8. Delete any old generated files (if needed)
  8a. If a category gets removed from the `metrics.yaml` file, glean does not automatically remove the old corresponding generated file, so we need to do that manually
