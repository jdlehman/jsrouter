# Changelog

## 0.5.0

Fixed:

- `unrecognizedRouteHandler` is now only called when a route is being entered, not when it is left. This prevents the handler from being called twice on unrecognized routes. [579e27a](../../commit/579e27a)

## 0.4.0 (2015-10-30)

Added:

- Added new lifecycle hooks `beforeRouteChange` and `afterRouteChange` that are called before the `leave` handler and `after` the enter handler respectively. [4f2eba7](../../commit/4f2eba7)
- Added `persistState` configuration instead of always using `window.history.replaceState`. `replaceState` is still the default, but now `pushState` or another function can be used in its stead. [ef57f12](../../commit/ef57f12)

Fixed:

- Bug where default route change behavior could be overridden with `handleRouteChange` config hook. [4f2eba7](../../commit/4f2eba7)
- Bug where `enter` route handler was not called on load. [52067c4](../../commit/52067c4)

Breaking Changes:

- Removed `handleRouteChange` hook as using it caused the router to not work. Use `beforeRouteChange` and `afterRouteChange` hooks instead. [4f2eba7](../../commit/4f2eba7)

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
