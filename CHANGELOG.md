# Changelog

## 0.3.0 (2015-10-26)

Added:

- Added optional `options` argument to `navigate` function. Supports `trigger` option that forces `handleRouteChange` to be called even if the route has not changed. [5e2f120](../../commit/5e2f120)

## 0.2.0 (2015-10-12)

Changed:

- Removed use of `window` external in webpack configuration. This means there is less configuration to use `jsrouter` as a `window` module does not need to be provided. [0e2bbd0](../../commit/0e2bbd0)

## 0.1.0 (2015-09-26)

- Updated dependencies and enough documentation to warrant a minor release.

## 0.0.5 (2015-07-21)

- Initial stable release.
