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
import {LitElement, PropertyValues, html, property, query, customElement} from '@polymer/lit-element/lit-element.js';
import {classMap} from 'lit-html/directives/classMap.js';
import {MDCShortTopAppBarFoundation, MDCFixedTopAppBarFoundation, MDCTopAppBarFoundation, strings} from '@material/top-app-bar';
import {style} from './mwc-top-app-bar-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-top-app-bar': TopAppBar;
  }
}

@customElement('mwc-top-app-bar' as any)
export class TopAppBar extends LitElement {

  private _foundation: MDCShortTopAppBarFoundation|MDCFixedTopAppBarFoundation|MDCTopAppBarFoundation|undefined;

  private _scrollTarget = window as any;

  @query('.mdc-top-app-bar')
  private _root: HTMLElement|null;

  @query('[name="navigationIcon"]')
  private _navIconSlot: HTMLSlotElement|null;

  @query('[name="actionItems"]')
  private _actionItemsSlot: HTMLSlotElement|null;

  @property({type: Boolean})
  fixed = false;

  @property({type: Boolean})
  prominent = false;

  @property({type: Boolean})
  short = false;

  @property({type: Boolean})
  shortCollapsed = false;

  renderStyle() {
    return style;
  }

  // TODO(sorvell): MDC decorates the navigation icon and action items with
  // ripples. Since these are slotted items here, the assumption is that the
  // user brings a web component with a ripple if rippling is desired.
  render() {
    const classes = {
      'mdc-top-app-bar--fixed': this.fixed,
      'mdc-top-app-bar--short': this.shortCollapsed || this.short,
      'mdc-top-app-bar--short-collapsed': this.shortCollapsed,
      'mdc-top-app-bar--prominent': this.prominent
    };
    return html`
      ${this.renderStyle()}
      <header class="mdc-top-app-bar ${classMap(classes)}">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <slot name="navigationIcon"></slot>
          <span class="mdc-top-app-bar__title"><slot name="title"></slot></span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
          <slot name="actionItems"></slot>
        </section>
      </div>
    </header>`;
  }

  updated(changedProperties: PropertyValues) {
    // update foundation if `short` or `fixed` changes
    if (changedProperties.has('short') || changedProperties.has('fixed')) {
      if (this._foundation) {
        this._foundation.destroy();
      }
      const adapter = {
        hasClass: (className) => this._root.classList.contains(className),
        addClass: (className) => this._root.classList.add(className),
        removeClass: (className) => this._root.classList.remove(className),
        setStyle: (property, value) => this._root.style.setProperty(property, value),
        getTopAppBarHeight: () => this._root.clientHeight,
        // TODO(sorvell): don't understand why the top-app-bar knows about navigation
        registerNavigationIconInteractionHandler: (type, handler) => {
          if (this._navIconSlot) {
            this._navIconSlot.addEventListener(type, handler);
          }
        },
        deregisterNavigationIconInteractionHandler: (type, handler) => {
          if (this._navIconSlot) {
            this._navIconSlot.removeEventListener(type, handler);
          }
        },
        notifyNavigationIconClicked: () => {
          this.dispatchEvent(new Event(strings.NAVIGATION_EVENT, {bubbles: true, cancelable: true});
        },
        registerScrollHandler: (handler) => this._scrollTarget.addEventListener('scroll', handler),
        deregisterScrollHandler: (handler) => this._scrollTarget.removeEventListener('scroll', handler),
        registerResizeHandler: (handler) => window.addEventListener('resize', handler),
        deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
        getViewportScrollY: () =>
          this._scrollTarget[this._scrollTarget === window ? 'pageYOffset' : 'scrollTop'],
        getTotalActionItems: () =>
          this._actionItemsSlot.assignedNodes({flatten: true}).length,
      };
      const Foundation = this.short ? MDCShortTopAppBarFoundation :
          (this.fixed ? MDCFixedTopAppBarFoundation : MDCTopAppBarFoundation);
      this._foundation = new Foundation(adapter);
      this._foundation.init();
    }
  }

}