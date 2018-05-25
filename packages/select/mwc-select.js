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
import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {MDCWebComponentMixin} from '@material/mwc-base/mdc-web-component.js';
import {MDCWCMenu} from '@material/mwc-menu/mwc-menu.js';
import {MDCSelect} from '@material/select';
import * as MDCSelectConstants from '@material/select/constants.js';
import {style} from './mwc-select-css.js';
import {afterNextRender} from '@material/mwc-base/utils.js';
import {MDCFloatingLabel} from '@material/floating-label/index';
import {MDCLineRipple} from '@material/line-ripple/index';

// this element depend on the `mwc-list-item` and `mwc-list-item-separator`
// elements to be registered ahead of time
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item-separator.js';

class MDCWSelect extends MDCWebComponentMixin(MDCSelect) {
  get items() {
    return this.host.items;
  }

  get listItems() {
    return this.items.map((e) => e.listItem);
  }


  get options() {
    return this.listItems;
  }

  initialize(
    labelFactory = el => new MDCFloatingLabel(el),
    lineRippleFactory = el => new MDCLineRipple(el)
  ) {
    const host = this.root_.getRootNode().host;
    this.nativeControl_ = host.querySelector("select");
    const labelElement = this.root_.querySelector(MDCSelectConstants.strings.LABEL_SELECTOR);

    if (labelElement) {
      this.label_ = labelFactory(labelElement);
    }

    const lineRippleElement = this.root_.querySelector(MDCSelectConstants.strings.LINE_RIPPLE_SELECTOR);

    if (lineRippleElement) {
      this.lineRipple_ = lineRippleFactory(lineRippleElement);
    }

    if (this.root_.classList.contains(MDCSelectConstants.cssClasses.BOX)) {
      this.ripple = this.initRipple_();
    }
  }

  get selectedOptions() {
    return this.listItems.filter((e) => e.matches('[aria-selected]'));
  }
}

export class Select extends LitElement {
  static get properties() {
    return {
      label: String,
      disabled: Boolean,
      box: Boolean,
    };
  }

  constructor() {
    super();
    this.label = '';
    this.disabled = false;
    this.box = false;

    this.addEventListener('focus', (e) => {
      this.classList.add('_focused');
    }, true);
    this.addEventListener('blur', (e) => {
      this.classList.remove('_focused');
    }, true);
  }

  // TODO(sorvell) #css: flex for sizing
  _render({label, disabled, box}) {
    return html`
      <style>
        :host {
          display: inline-flex;
        }
        .mdc-select {
          flex: 1;
        }
      </style>
      ${style}
      <div class$="mdc-select ${box ? 'mdc-select--box' : ''}" role="listbox" aria-disabled$="${disabled}">
        <slot></slot>
        <div class="mdc-floating-label">${label}</div>
        <div class="mdc-line-ripple"></div>
      </div>`;
  }

  async ready() {
    super.ready();
    await afterNextRender();
    this._makeComponent();
  }

  _makeComponent() {
    const root = this._root.querySelector('.mdc-select');
    this._mdcComponent = new MDCWSelect(root);
  }

  get items() {
    return this.shadowRoot.querySelector('slot').assignedNodes({flatten: true})
      .filter((e) => e.localName == 'mwc-list-item');
  }

  get value() {
    return this._mdcComponent.value;
  }

  get selectedOptions() {
    this._makeComponent.selectedOptions;
  }

  get selectedIndex() {
    return this._mdcComponent.selectedIndex;
  }

  set selectedIndex(selectedIndex) {
    this._mdcComponent.selectedIndex = selectedIndex;
  }

  item(index) {
    return this._mdcComponent.item(index);
  }

  nameditem(key) {
    this._mdcComponent.named;
    // NOTE: IE11 precludes us from using Array.prototype.find
    for (let i = 0, options = this.options, option; (option = options[i]); i++) {
      if (option.id === key || option.getAttribute('name') === key) {
        return option;
      }
    }
    return null;
  }
}

customElements.define('mwc-select', Select);
