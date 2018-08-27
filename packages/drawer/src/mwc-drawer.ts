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
import {MDCPersistentDrawerFoundation, MDCTemporaryDrawerFoundation, util} from '@material/drawer';
import {style} from './mwc-drawer-css.js';

const kindToFoundation = {
  temporary: MDCTemporaryDrawerFoundation,
  persistent: MDCPersistentDrawerFoundation
}

function foundationForKind(kind) {
  return kindToFoundation[kind] || kindToFoundation.temporary;
}

export class Drawer extends LitElement {

  @property({type: String})
  kind: 'temporary';

  @property({type: Boolean})
  opened = false;

  @property({type: Boolean})
  hasHeader = false;

  private _root: HTMLElement|undefined;
  private _drawer: HTMLElement|undefined;

  private _foundation: MDCPersistentDrawerFoundation | MDCTemporaryDrawerFoundation | null = null;

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <aside class="mdc-drawer mdc-drawer--${this.kind} mdc-typography">
        <nav class="mdc-drawer__drawer">
          ${this.hasHeader && html`<header class="mdc-drawer__header">
            <div class="mdc-drawer__header-content">
              <slot name="header"><slot>
            </div>
          </header>`}
          <nav class="mdc-drawer__content">
            <slot name="content"></slot>
          </nav>
        </nav>
      </aside>
      `;
  }

  firstRendered() {
    this._root = this.shadowRoot.querySelector('aside');
    this._drawer = this.shadowRoot.querySelector('mdc-drawer__drawer');
  }

  update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    if (changedProperties.has('kind')) {
      if (this._foundation) {
        this._foundation.destroy();
      }
      const Foundation = foundationForKind(this.kind);
      const adapter = {
        addClass: (className) => this._root.classList.add(className),
        removeClass: (className) => this._root.classList.remove(className),
        hasClass: (className) => this._root.classList.contains(className),
        hasNecessaryDom: true,
        registerInteractionHandler: (evt, handler) =>
          this._root.addEventListener(util.remapEvent(evt), handler, util.applyPassive()),
        deregisterInteractionHandler: (evt, handler) =>
          this._root.removeEventListener(util.remapEvent(evt), handler, util.applyPassive()),
        registerDrawerInteractionHandler: (evt, handler) =>
          this._drawer.addEventListener(util.remapEvent(evt), handler),
        deregisterDrawerInteractionHandler: (evt, handler) =>
          this._drawer.removeEventListener(util.remapEvent(evt), handler),
        registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
        deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
        getDrawerWidth: () => this._drawer.offsetWidth,
        setTranslateX: (value) => this._drawer.style.setProperty(
          util.getTransformPropertyName(), value === null ? null : `translateX(${value}px)`),
        updateCssVariable: (value) => {
          if (util.supportsCssCustomProperties()) {
            this._root.style.setProperty(OPACITY_VAR_NAME, value);
          }
        },
        getFocusableElements: () => this.querySelectorAll(FOCUSABLE_ELEMENTS),
        saveElementTabState: (el) => util.saveElementTabState(el),
        restoreElementTabState: (el) => util.restoreElementTabState(el),
        makeElementUntabbable: (el) => el.setAttribute('tabindex', -1),
        isRtl: () => getComputedStyle(this._root).getPropertyValue('direction') === 'rtl',
        isDrawer: (el) => el === this._drawer,
        notifyOpen: () => this.emit(MDCPersistentDrawerFoundation.strings.OPEN_EVENT),
        notifyClose: () => this.emit(MDCPersistentDrawerFoundation.strings.CLOSE_EVENT),
      };
      if (this.kind === 'temporary') {
        Object.assign(adapter, {
          addBodyClass: (className) => document.body.classList.add(className),
          removeBodyClass: (className) => document.body.classList.remove(className),
          eventTargetHasClass: (target, className) => target.classList.contains(className),
          registerTransitionEndHandler: (handler) => this._drawer.addEventListener('transitionend', handler),
          deregisterTransitionEndHandler: (handler) => this._drawer.removeEventListener('transitionend', handler),
          notifyOpen: () => this.emit(MDCTemporaryDrawerFoundation.strings.OPEN_EVENT),
          notifyClose: () => this.emit(MDCTemporaryDrawerFoundation.strings.CLOSE_EVENT),
        });
      }
      this._foundation = new Foundation({this._root, adapter});
    }
    if (changedProperties.has('opened')) {
      this._foundation.setOpen(this.opened);
    }
  }

}

customElements.define('mwc-drawer', Drawer);
