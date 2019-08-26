# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
- Components no longer automatically load the Material Icons font, so that
  users have control over how fonts are loaded. Users can still import the
  `mwc-icon-font.js` module themselves to automatically load the font from
  fonts.googleapis.com.
- Fix layout issue affecting scrolling `<mwc-tab-bar>` in Firefox.
- Fix bug where `<mwc-icon>` icons did not render in IE11.
- Buttons slotted into `<mwc-snackbar>` now render with correct default styles.
  Add `--mdc-snackbar-action-color` CSS custom property to override default
  action button color.
- Fix bug where `<mwc-snackbar>` `open` method threw if called immediately
  after construction (before `firstUpdated`).
- Add support for `<svg>` and `<img>` to `<mwc-icon-button>`
- Add `lit-analyzer` to CI
- Only set up structure in `bootstrap`, make `build` explicit.
  Run `lint` and `format` in CI
- Remove CHANGELOG files in packages
- Add section about CHANGELOG entries to CONTRIBUTING guide
- Remove `as any` from `@customElement` decorators
- Improve README for `<mwc-button>`
- Improve README for `<mwc-icon-button>`
- Split toggling icon button out into `@material/mwc-icon-button-toggle` with tag name `<mwc-icon-button-toggle>`
- Fix bug where setting the `checked` property on an `<mwc-radio>` did not
  result in the other radios in the group becoming unchecked.
- Fix bug where `<mwc-drawer>` did not work in IE (via
  [WICG/inert#129](https://github.com/WICG/inert/pull/129))
- Split mwc-top-app-bar fixed and short variants into separate components
- Removed, and readded mwc-top-app-bar `centerTitle`, fixing padding with `dense` and `prominent` setting
- Implemented:
  - mwc-textfield
  - mwc-textarea
  - mwc-notched-outline
  - mwc-line-ripple-directive
  - mwc-floating-label-directive
  - mwc-top-app-bar-fixed
  - mwc-top-app-bar-short
- Testing Infra:
  - Tests now in TS
  - Tests now all pass in evergreens but still failing in IE and Safari 9
  - Using Koa Karma proxy server and auto-amd-ifies files
  - Can now run individual tests using npm run test -- --packages mwc-icon-button*,mwc-button
- Fix bug where setting the `<mwc-snackbar>` `labelText` property could throw
  an exception and fail to render
  ([#367](https://github.com/material-components/material-components-web-components/issues/367)).

## [0.6.0] - 2019-06-05
- Upgrade lerna to 3.x
- Upgrade typescript to 3.4, add config for tsbuildinfo files needed for incremental compilation mode
- Add README notes that component set is in experimental status.
- Remove draft components, simplify package listing.
- Prepare drawer, icon-button, linear-progress, slider, snackbar, tab components, and top-app-bar for release.
- Fix typing for event listeners in adapters due to typescript update.
- Add wicg-inert and blocking-elements dependencies to mwc-drawer

## [0.5.0] - 2019-03-26
- Update to mdc 1.0
- Rewrite Adapters and Foundations with Typescript types
- Disable pointer-events on disabled buttons

## [0.4.0] - 2019-03-11
- Update to mdc 0.44
- fix button label issues

## [0.3.6] - 2019-02-05
- Use `static get styles()` on all components
- Clean up dependencies
- Implement drawer focus trapping
- Add tests
- Setup travis CI
- Update to lit-html 1.0

## [0.3.5] - 2019-01-11
- Update lit and lit-element dependencies
- Publish mwc-drawer

## [0.3.4] - 2018-12-13
- Update to lit-element 0.6.5 and lit-html 1.0.0-rc.1

## [0.3.3] - 2018-12-03
- Fix ripple directive for lit-html 0.13

## [0.3.2] - 2018-11-16
- Move event listeners to the class with lit-element 0.6.2
- Add `@eventOptions({passive: true})` to event handlers in tab-bar-scroller
  - More efficient scrolling behavior, as `preventDefault` is never called
- Implement icon-button in typescript

## [0.3.1] - 2018-10-08
- Fix demo publishing
- Update to lit-element 0.6.2
- Add dependencies to lit-html where necessary
- Add explicit `.js` endings to imports, where necessary
- Fill in CHANGELOG

## [0.3.0] - 2018-10-04
- Rewrite elements in typescript
- Add `ripple` lit directive to add a material ripple to any component
- Add `@observe` decorator to tie data changes into base MDC Foundation handlers
- Add a watcher for styling and typescript changes

## [0.2.1] - 2018-09-21
- Update to lit-element 0.6.1

## [0.2.0] - 2018-09-13
- Use lit-element 0.6

## [0.1.2] - 2018-06-14
- Use lit-element 0.5

## [0.1.1] - 2018-05-09
- Add READMEs and examples

## [0.1.0] - 2018-05-08
- Initial WIP of components
