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
import {LitElement, html, property, PropertyValues} from '@polymer/lit-element/lit-element.js';
import MDCSwitchFoundation from '@material/switch/foundation.js';
import {style} from './mwc-switch-css.js';
import {attachRipple} from '@material/mwc-ripple/ripple-helper.js';

export class Switch extends LitElement {
  @property({type: Boolean})
  checked = false;

  @property({type: Boolean})
  disabled = false;

  _root: HTMLElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _foundation: MDCSwitchFoundation | null = null;

  renderStyle() {
    return style;
  }

  private _handleChange(e: Event) {
    this._foundation!.handleChange(e);
  }

  private _initRipple() {
    const {RIPPLE_SURFACE_SELECTOR} = MDCSwitchFoundation.strings;
    const rippleSurface: HTMLElement = this.shadowRoot!.querySelector(RIPPLE_SURFACE_SELECTOR);
    return attachRipple(this, rippleSurface, this._input!);
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div class="mdc-switch">
        <div class="mdc-switch__track"></div>
        <div class="mdc-switch__thumb-underlay">
          <div class="mdc-switch__thumb">
            <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch" @change="${(e: Event) => this._handleChange(e)}}">
          </div>
        </div>
      </div>
      <slot></slot>
      `;
  }

  update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    if (changedProperties.has('disabled')) {
      this._foundation.setDisabled(this.disabled);
    }
    if (changedProperties.has('checked')) {
      this._foundation.setChecked(this.checked);
    }
  }

  firstRendered() {
    this._input = this.shadowRoot!.querySelector(MDCSwitchFoundation.strings.NATIVE_CONTROL_SELECTOR);
    this._root = this.shadowRoot!.querySelector('.mdc-switch');
    this._foundation = new MDCSwitchFoundation({
      addClass: (className: string) => {this._root!.classList.add(className)},
      removeClass: (className: string) => {this._root!.classList.remove(className)},
      setNativeControlChecked: (checked: boolean) => {this._input!.checked = checked},
      setNativeControlDisabled: (disabled: boolean) => {this._input!.disabled = disabled}
    });
    this._initRipple();
  }

  click() {
    this._input!.click();
  }

  focus() {
    this._input!.focus();
  }
}

customElements.define('mwc-switch', Switch);
