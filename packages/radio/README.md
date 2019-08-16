# `<mwc-radio>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-radio.svg)](https://www.npmjs.com/package/@material/mwc-radio)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Radio buttons allow the user to select one option from a set. Use radio buttons when the user needs to see all available options.

<img src="images/standard.png" width="84px" height="48px">

[Material Design Guidelines: Radio buttons](https://material.io/design/components/selection-controls.html#radio-buttons)

## Installation

```sh
npm install @material/mwc-radio
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example usage

### Standard

<img src="images/standard.png" width="84px" height="48px">

```html
<mwc-radio name="myGroup" value="value1"></mwc-radio>
<mwc-radio name="myGroup" value="value2" checked></mwc-radio>

<script type="module">
  import '@material/mwc-radio';
</script>
```

### Custom color

<img src="images/custom_color.png" width="84px" height="48px">

```css
mwc-radio {
  --mdc-theme-secondary: #ff4081;
}
```

## API

### Slots
*None*

### Properties/Attributes

| Name            | Type      | Default | Description
| --------------- | --------- |-------- | -----------
| `checked`       | `boolean` | `false` | Whether this radio button is the currently-selected one in its group. Maps to the native [`checked`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#checked) attribute.
| `disabled`      | `boolean` | `false` | If `true`, this radio button cannot be selected or de-selected. Maps to the native [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled) attribute.
| `name`          | `string`  | `''`    | Name of the input for form submission, and identifier for the selection group. Only one radio button can be checked for a given selection group. Maps to the native [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name) attribute.
| `value`         | `string`  | `''`    | Value of the input for form submission. Maps to the native [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#value) attribute.

### Methods
*None*

### Events
| Name     | Detail | Description
| ---------| ------ | -----------
| `change` | `{}`   | Indicates that the radio button's `checked` state has changed.

### CSS Custom Properties

| Name                    | Default                                | Description
| ----------------------- | -------------------------------------- |------------
| `--mdc-theme-secondary` | ![](images/color_018786.png) `#018786` | Color of the radio button.

## Additional references

- [MDC Web: Radio Buttons](https://material.io/develop/web/components/input-controls/radio-buttons/)
