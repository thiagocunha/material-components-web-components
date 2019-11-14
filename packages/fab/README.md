# `<mwc-fab>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-fab.svg)](https://www.npmjs.com/package/@material/mwc-fab)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

A floating action button (FAB) represents the primary action of a screen.

![](images/standard.png)
![](images/mini.png)
![](images/extended.png)
![](images/custom_color.png)

[Material Design Guidelines: Floating Action Button](https://material.io/design/components/buttons-floating-action-button.html)

## Installation

```sh
npm install @material/mwc-fab
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

![](images/standard.png)

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block">

<mwc-fab icon="favorite"></mwc-fab>

<script type="module">
  import '@material/mwc-fab';
  const fab = document.querySelector('mwc-fab');
  fab.addEventListener('click', () => {
    addFavorite();
  });
</script>
```

### Mini

![](images/mini.png)

```html
<mwc-fab mini icon="add"></mwc-fab>
```

### Extended

![](images/extended.png)

```html
<mwc-fab extended icon="shopping_cart" label="Add to cart"></mwc-fab>
```
### Customize colors

![](images/custom_color.png)

```css
mwc-fab {
  --mdc-theme-secondary: white;
  --mdc-theme-on-secondary: black;
}
```

## API

### Slots
*None*

### Properties/Attributes

| Name            | Type      | Description
| --------------- | --------- |------------
| `icon`          | `string`  | The icon to display.
| `label`         | `string`  | The label to display when using the `extended` layout, and the `aria-label` attribute in all layouts.
| `mini`          | `boolean` | Modifies the FAB to be a smaller size, for use on smaller screens. Defaults to `false`.
| `extended`      | `boolean` | Enable the *extended* layout which includes a text label. Defaults to `false`.
| `showIconAtEnd` | `boolean` | When in the *extended* layout, position the icon after the label, instead of before. Defaults to `false`.

### Methods
*None*

### Events
*None*

### CSS Custom Properties

| Name                       | Default                                | Description
| -------------------------- | -------------------------------------- |------------
| `--mdc-icon-font`          | [`Material Icons`](https://google.github.io/material-design-icons/) | Font to use for the icon.
| `--mdc-theme-on-secondary` | ![](images/color_ffffff.png) `#ffffff` | Foreground color of the label and icon.
| `--mdc-theme-secondary`    | ![](images/color_018786.png) `#018786` | Background color of the FAB.

## Additional references

- [MDC Web: Floating Action Button](https://material.io/develop/web/components/buttons/floating-action-buttons/)
