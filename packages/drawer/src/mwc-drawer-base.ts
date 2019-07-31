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
import {
  BaseElement,
  html,
  property,
  observer,
  query,
  PropertyValues,
  classMap,
  addHasRemoveClass,
} from '@material/mwc-base/base-element.js';
import MDCModalDrawerFoundation from '@material/drawer/modal/foundation.js';
import MDCDismissibleDrawerFoundation from '@material/drawer/dismissible/foundation.js';
import {MDCDrawerAdapter} from '@material/drawer/adapter.js';
import {strings} from '@material/drawer/constants.js';
import 'wicg-inert/dist/inert.js';
import {DocumentWithBlockingElements} from 'blocking-elements';

interface InertableHTMLElement extends HTMLElement {
  inert?: boolean;
}

const blockingElements =
    (document as DocumentWithBlockingElements).$blockingElements;

export class DrawerBase extends BaseElement {
  @query('.mdc-drawer')
  protected mdcRoot!: HTMLElement;

  @query('.mdc-drawer-app-content')
  protected appContent!: InertableHTMLElement;

  protected mdcFoundation!: MDCDismissibleDrawerFoundation;

  protected get mdcFoundationClass() {
    return this.type === 'modal' ? MDCModalDrawerFoundation : MDCDismissibleDrawerFoundation;
  }

  protected createAdapter(): MDCDrawerAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      elementHasClass: (element: HTMLElement, className: string) => element.classList.contains(className),
      saveFocus: () => {
        // Note, casting to avoid cumbersome runtime check.
        this._previousFocus = (this.getRootNode() as any as DocumentOrShadowRoot).activeElement as HTMLElement|null;
      },
      restoreFocus: () => {
        const previousFocus = this._previousFocus && this._previousFocus.focus;
        if (previousFocus) {
          this._previousFocus!.focus();
        }
      },
      notifyClose: () => {
        this.open = false;
        this.dispatchEvent(new Event(strings.CLOSE_EVENT, {bubbles: true, cancelable: true}));
      },
      notifyOpen: () => {
        this.open = true;
        this.dispatchEvent(new Event(strings.OPEN_EVENT, {bubbles: true, cancelable: true}));
      },
      // TODO(sorvell): Implement list focusing integration.
      focusActiveNavigationItem: () => {
      },
      trapFocus: () => {
        blockingElements.push(this);
        this.appContent.inert = true;
      },
      releaseFocus: () => {
        blockingElements.remove(this);
        this.appContent.inert = false;
      },
    };
  }

  private _previousFocus: HTMLElement|null = null;

  private _handleScrimClick() {
    if (this.mdcFoundation instanceof MDCModalDrawerFoundation) {
      this.mdcFoundation.handleScrimClick();
    }
  };

  @observer(function(this: DrawerBase, value: boolean) {
    if (this.type === '') {
      return;
    }
    if (value) {
      this.mdcFoundation.open();
    } else {
      this.mdcFoundation.close();
    }
  })
  @property({type: Boolean, reflect: true})
  open = false;

  @property({type: Boolean})
  hasHeader = false;

  @property({reflect: true})
  type = '';

  render() {
    const dismissible = this.type === 'dismissible' || this.type === 'modal';
    const modal = this.type === 'modal';
    const header = this.hasHeader ? html`
      <div class="mdc-drawer__header">
        <h3 class="mdc-drawer__title"><slot name="title"></slot></h3>
        <h6 class="mdc-drawer__subtitle"><slot name="subtitle"></slot></h6>
        <slot name="header"></slot>
      </div>
      ` : '';
    return html`
      <aside class="mdc-drawer
          ${classMap({'mdc-drawer--dismissible': dismissible, 'mdc-drawer--modal': modal})}">
        ${header}
        <div class="mdc-drawer__content"><slot></slot></div>
      </aside>
      ${modal ? html`<div class="mdc-drawer-scrim" @click="${this._handleScrimClick}"></div>` : ''}
      <div class="mdc-drawer-app-content">
        <slot name="appContent"></slot>
      </div>
      `;
  }

  // note, we avoid calling `super.firstUpdated()` to control when `createFoundation()` is called.
  firstUpdated() {
    this.mdcRoot.addEventListener('keydown', (e) => this.mdcFoundation.handleKeydown(e));
    this.mdcRoot.addEventListener('transitionend', (e) => this.mdcFoundation.handleTransitionEnd(e));
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('type')) {
      this.createFoundation();
    }
  }
}
