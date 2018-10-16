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
import {BaseElement, html, property, query, customElement, Adapter, Foundation} from '@material/mwc-base/base-element.js';
import {TabIndicator} from '@material/mwc-tab-indicator';

// Make TypeScript not remove the import.
import '@material/mwc-tab-indicator';

import {classMap} from 'lit-html/directives/classMap';
import {ripple} from '@material/mwc-ripple/ripple-directive';
import MDCTabFoundation from '@material/tab/foundation';
import {style} from './mwc-tab-css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab': Tab;
  }
}

export interface TabFoundation extends Foundation {
  handleClick(): void;
  activate(clientRect: ClientRect): void;
  deactivate(): void;
  computeDimensions(): {rootLeft: number, rootRight: number, contentLeft: number, contentRight: number}
}

export declare var TabFoundation: {
  prototype: TabFoundation;
  new(adapter: Adapter): TabFoundation;
}

@customElement('mwc-tab' as any)
export class Tab extends BaseElement {

  protected mdcFoundation!: MDCTabFoundation;

  protected readonly mdcFoundationClass: typeof TabFoundation = MDCTabFoundation;

  @query('.mdc-tab')
  protected mdcRoot!: HTMLElement;

  @query('mwc-tab-indicator')
  protected tabIndicator!: TabIndicator;

  @property()
  label = '';

  @property()
  icon = '';

  @property({type: Boolean})
  isFadingIndicator = false;

  @property({type: Boolean})
  minWidth = false;

  @property({type: Boolean})
  isMinWidthIndicator = false;

  @property()
  indicatorIcon = '';

  @property({type: Boolean})
  stacked = false;

  /**
   * Other properties
   * indicatorContent <slot>
   * previousIndicatorClientRect (needed?)
   * onTransitionEnd (needed?)
   */

  @query('mwc-tab-indicator')
  private _tabIndicator!: HTMLElement;

  @query('.mdc-tab__content')
  private _contentElement!: HTMLElement;

  private _handleClick(e: Event) {
    this.mdcFoundation.handleClick(e);
  }

  createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  renderStyle() {
    return style;
  }

  render() {
    const classes = {
      'mdc-tab--min-width': this.minWidth,
      'mdc-tab--stacked': this.stacked
    };
    return html`
      ${this.renderStyle()}
      <button @click="${this._handleClick}" class="mdc-tab ${classMap(classes)}" role="tab" aria-selected="false" tabindex="-1">
        <span class="mdc-tab__content">
          <slot></slot>
          ${this.icon ? html`<span class="mdc-tab__icon material-icons">${this.icon}</span>` : ''}
          ${this.label ? html`<span class="mdc-tab__text-label">${this.label}</span>` : ''}
          ${this.isMinWidthIndicator ? this.renderIndicator() : ''}
        </span>
        ${this.isMinWidthIndicator ? '' : this.renderIndicator()}
        <span class="mdc-tab__ripple" .ripple="${ripple({interactionNode: this, unbounded: false})}"></span>
      </button>`;
  }

  renderIndicator() {
    return html`<mwc-tab-indicator
        .icon="${this.indicatorIcon}"
        .fade="${this.isFadingIndicator}"></mwc-tab-indicator>`;
  }


  createAdapter() {
    return {
      ...super.createAdapter(),
      setAttr: (attr: string, value: string) => this.mdcRoot.setAttribute(attr, value),
      activateIndicator: (previousIndicatorClientRect: ClientRect) =>
          (this._tabIndicator as TabIndicator).activate(previousIndicatorClientRect),
      deactivateIndicator: () =>
          (this._tabIndicator as TabIndicator).deactivate(),
      notifyInteracted: () => this.dispatchEvent(
          new CustomEvent(MDCTabFoundation.strings.INTERACTED_EVENT, {
            detail: {tab: this},
            bubbles: true,
            composed: true,
            cancelable: true
          })),
      getOffsetLeft: () => this.offsetLeft,
      getOffsetWidth: () => this.mdcRoot.offsetWidth,
      getContentOffsetLeft: () => this._contentElement.offsetLeft,
      getContentOffsetWidth: () => this._contentElement.offsetWidth,
      focus: () => this.mdcRoot.focus(),
    }
  }

  activate(clientRect: ClientRect) {
    this.mdcFoundation.activate(clientRect);
  }

  deactivate() {
    this.mdcFoundation.deactivate();
  }

  computeDimensions() {
    return this.mdcFoundation.computeDimensions();
  }

  computeIndicatorClientRect() {
    return this.tabIndicator.computeContentClientRect();
  }

  // NOTE: needed only for ShadyDOM where delegatesFocus is not implemented
  focus() {
    this.mdcRoot.focus();
  }

}