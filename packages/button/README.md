# `<mwc-button>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-button.svg)](https://www.npmjs.com/package/@material/mwc-button)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Buttons allow users to take actions, and make choices, with a single tap.

[Material Design Guidelines: Button](https://material.io/design/components/buttons.html)

## Installation

```sh
npm install @material/mwc-button
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example Usage

### Standard

![](images/standard.png)
![](images/standard_with_icon.png)

```html
<mwc-button label="standard"></mwc-button>
<mwc-button label="standard" icon="code"></mwc-button>
```

### Outlined

![](images/outlined.png)
![](images/outlined_with_icon.png)

```html
<mwc-button outlined label="outlined"></mwc-button>
<mwc-button outlined label="outlined" icon="code"></mwc-button>
```

### Raised

![](images/raised.png)
![](images/raised_with_icon.png)

```html
<mwc-button raised label="raised"></mwc-button>
<mwc-button raised label="raised" icon="code"></mwc-button>
```

### Unelevated

![](images/unelevated.png)
![](images/unelevated_with_icon.png)

```html
<mwc-button unelevated label="unelevated"></mwc-button>
<mwc-button unelevated label="unelevated" icon="code"></mwc-button>
```

### Dense

![](images/dense.png)
![](images/dense_with_icon.png)

```html
<mwc-button dense unelevated label="dense"></mwc-button>
<mwc-button dense unelevated label="dense" icon="code"></mwc-button>
```

### Trailing Icon

![](images/trailing_icon.png)

```html
<mwc-button label="trailing icon" icon="code" trailingIcon></mwc-button>
```

### Disabled

![](images/disabled.png)
![](images/disabled_with_icon.png)

```html
<mwc-button disabled label="disabled"></mwc-button>
<mwc-button disabled label="disabled" icon="code"></mwc-button>
```

### Customize Colors

![](images/custom_color.png)

```css
mwc-button {
  --mdc-theme-primary: #e9437a;
  --mdc-theme-on-primary: white;
}
```

## API

### Slots
*None*

### Properties/Attributes
| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| `icon` | `string` | `''` | Icon to display, and `aria-label` value when `label` is not defined.
| `label` | `string` | `''` | Label to display for the button, and `aria-label`.
| `raised` | `boolean` | `false` | Creates a contained button that is elevated above the surface.
| `unelevated` | `boolean` | `false` | Creates a contained button that is flush with the surface.
| `outlined` | `boolean` | `false` | Creates an outlined button that is flush with the surface.
| `dense` | `boolean` | `false` | Makes the button text and container slightly smaller.
| `disabled` | `boolean` | `false` | Disabled buttons cannot be interacted with and have no visual interaction effect.
| `trailingIcon` | `boolean` | `false` | When `true`, `icon` will be displayed _after_ `label`.

### Methods
*None*

### Events
*None*

### CSS Custom Properties

| Name | Default | Description
| ---- | ------- | -----------
| `--mdc-icon-font` | [`Material Icons`](https://google.github.io/material-design-icons/) | Font to use for the icon.
| `--mdc-theme-primary` | ![](images/color_6200ee.png) `#6200ee` | Background color of the button
| `--mdc-theme-on-primary` | ![](images/color_ffffff.png) `#ffffff` | Text color of the button
| `--mdc-button-text-transform` | `uppercase` | Sets the text-transform on the button label.
| `--mdc-button-letter-spacing` | `normal` | Sets the letter-spacing on the button label.
| `--mdc-button-horizontal-padding` | filled: `16px` outlined: `15px` | Sets the padding to the left and right of the button label equal to this value on filled buttons and `--mdc-button-horizontal-padding - --mdc-outline-width` on outlined buttons.
| `--mdc-button-outline-width` | `1px` | Sets the width of the outline of an outlined button and attempts to keep the component size constant.
| `--mdc-button-outline-color` | ![](images/color_6200ee.png) `--mdc-theme-primary` | Sets the color of the outline of an outlined element. (Overrides `--mdc-theme-primary`)
| `--mdc-button-disabled-fill-color` | ![](images/color_0,0,0,12.png) `rgba(0,0,0,0.12)` | Sets the background fill color of a disabled raised or unelevated button.
| `--mdc-button-disabled-ink-color` | ![](images/color_0,0,0,37.png) `rgba(0,0,0,0.37)` | Sets the text color of a disabled button as well as the outline color of a disabled outlined button.
| `--mdc-button-disabled-outline-color` | ![](images/color_0,0,0,37.png) `--mdc-button-disabled-ink-color` | Sets the color of the outline of a disabled outlined button. (Overrides `--mdc-button-disabled-ink-color`)

## Additional references

- [MDC Web: Button](https://material.io/develop/web/components/buttons/)
