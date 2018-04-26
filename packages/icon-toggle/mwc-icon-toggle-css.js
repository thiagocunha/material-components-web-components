/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {html} from '@polymer/lit-element/lit-element.js';

export const style = html`<style>@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var: 1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug::before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-icon-toggle{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:transparent;will-change:transform, opacity;color:rgba(0,0,0,0.87);color:var(--mdc-theme-text-primary-on-light, rgba(0,0,0,0.87));display:flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;width:48px;height:48px;padding:12px;outline:none;font-size:1.5rem;cursor:pointer;user-select:none;will-change:initial}.mdc-icon-toggle::before,.mdc-icon-toggle::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-icon-toggle::before{transition:opacity 15ms linear;z-index:1}.mdc-icon-toggle.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-icon-toggle.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-icon-toggle.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-icon-toggle.mdc-ripple-upgraded--foreground-activation::after{animation:225ms mdc-ripple-fg-radius-in forwards,75ms mdc-ripple-fg-opacity-in forwards}.mdc-icon-toggle.mdc-ripple-upgraded--foreground-deactivation::after{animation:150ms mdc-ripple-fg-opacity-out;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-icon-toggle::before,.mdc-icon-toggle::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-icon-toggle.mdc-ripple-upgraded::before,.mdc-icon-toggle.mdc-ripple-upgraded::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-icon-toggle.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-icon-toggle::before,.mdc-icon-toggle::after{background-color:#000}.mdc-icon-toggle:hover::before{opacity:.04}.mdc-icon-toggle:not(.mdc-ripple-upgraded):focus::before,.mdc-icon-toggle.mdc-ripple-upgraded--background-focused::before{transition-duration:75ms;opacity:.12}.mdc-icon-toggle:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-icon-toggle:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:.16}.mdc-icon-toggle.mdc-ripple-upgraded{--mdc-ripple-fg-opacity: .16}.mdc-icon-toggle::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-icon-toggle--disabled{color:rgba(0,0,0,0.38);color:var(--mdc-theme-text-disabled-on-light, rgba(0,0,0,0.38));pointer-events:none}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';-webkit-font-smoothing:antialiased}:host{display:inline-block;outline:none}
</style>`;
