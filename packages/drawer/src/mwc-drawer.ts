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
import {LitElement, html, property, query, customElement} from '@polymer/lit-element/lit-element.js';
import {classMap} from 'lit-html/directives/classMap.js';
import {observer} from '@material/mwc-base/decorators.js';
import {MDCModalDrawerFoundation, MDCDismissibleDrawerFoundation, strings, util, createFocusTrap} from '@material/drawer';
import {style} from './mwc-drawer-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-drawer': Drawer;
  }
}

@customElement('mwc-drawer' as any)
export class Drawer extends LitElement {

  @query('.mdc-drawer')
  private _root: HTMLElement|null;

  private _foundation: MDCDismissibleDrawerFoundation | MDCModalDrawerFoundation | null = null;

  private _focusTrap = undefined;
  private _previousFocus: HTMLElement|undefined = undefined;

  @observer(function(this: Drawer, value: string) {
    const Foundation = value ? MDCModalDrawerFoundation : MDCDismissibleDrawerFoundation;
    if (this._foundation) {
      this._foundation.destroy();
    }
    const adapter = {
      addClass: (className) => this._root.classList.add(className),
      removeClass: (className) => this._root.classList.remove(className),
      hasClass: (className) => this._root.classList.contains(className),
      elementHasClass: (element, className) => element.classList.contains(className),
      computeBoundingRect: () => this._root.getBoundingClientRect(),
      saveFocus: () => {
        this._previousFocus = document.activeElement as HTMLElement;
      },
      restoreFocus: () => {
        const previousFocus = this._previousFocus && this._previousFocus.focus;
        if (this._root.contains(document.activeElement) && previousFocus) {
          this._previousFocus.focus();
        }
      },
      // TODO(sorvell): List integration like this may not work. Need to understand
      // why this is here.
      focusActiveNavigationItem: () => {
        // const activeNavItemEl = this._root.querySelector(`.${MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS}`)!;
        // if (activeNavItemEl) {
        //   (activeNavItemEl as HTMLElement).focus();
        // }
      },
      notifyClose: () => this.dispatchEvent(new Event(strings.CLOSE_EVENT, {bubbles: true, cancelable: true})),
      notifyOpen: () => this.dispatchEvent(new Event(strings.OPEN_EVENT, {bubbles: true, cancelable: true})),
      trapFocus: () => this._focusTrap.activate(),
      releaseFocus: () => this._focusTrap.deactivate(),
    };
    this._foundation = new Foundation(adapter);
    this._foundation.init();
  })

  @property({type: Boolean})
  set open(value) {
    // this._open = value;
    // this.requestUpdate({open: this.open});
    this.updateComplete.then(() => {
      if (value) {
        this._foundation.open();
      } else {
        this._foundation.close();
      }
    });
  }

  get open() {
    return this._foundation.isOpen();
  }

  @property({type: Boolean})
  hasHeader = false;

  @property({type: Boolean})
  dismissable = false;

  @property({type: Boolean})
  modal = false;

  constructor() {
    super();
    this.open = false;
  }

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <aside class="mdc-drawer
          ${classMap({'mdc-drawer--dismissable': this.dismissable, 'mdc-drawer--modal': this.modal})}">
        ${this.hasHeader ? html`
        <div class="mdc-drawer__header">
          <h3 class="mdc-drawer__title"><slot name="title"></slot></h3>
          <h6 class="mdc-drawer__subtitle"><slot name="subtitle"></slot></h6>
          <slot name="header"></slot>
        </div>
        ` : ''}
        <div class="mdc-drawer__content">
          <slot></slot>
        </div>
      </aside>
      ${this.modal ? html`<div class="mdc-drawer-scrim" @click="${() => this._foundation.handleScrimClick()}"></div>` : ''}
      `;
  }

  firstUpdated() {
    this._root.addEventListener('keydown', (e) => this._foundation.handleKeydown(e));
    this._root.addEventListener('transitionend', (e) => this._foundation.handleTransitionEnd(e));
    this._focusTrap = util.createFocusTrapInstance(this._root, createFocusTrap);
  }

}