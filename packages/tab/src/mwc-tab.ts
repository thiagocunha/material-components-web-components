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
import {BaseElement, html, property, observer, query, customElement, Adapter, Foundation} from '@material/mwc-base/base-element';
import {TabIndicator} from '@material/mwc-tab-indicator/mwc-tab-indicator.js';
import {classMap} from 'lit-html/directives/classMap.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import {MDCTabFoundation} from '@material/tab/foundation.js';
import {style} from './mwc-tab-css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab': Tab;
  }
}

export interface TabFoundation extends Foundation {
  handleClick(): void;
  activate(clientRect: DOMRect): void;
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
  mdcRoot!: HTMLElement;

  @query('mwc-tab-indicator')
  tabIndicator!: TabIndicator;

  @property()
  label = '';

  @property()
  icon = '';


  // TODO(sorvell): may not work without clientRect in activate?
  // private _previousIndicatorClientRect: DOMRect|undefined;
  @observer(function(this: Tab, value: boolean) {
    if (value) {
      this.activate();
    } else {
      this.deactivate();
    }
  })

  @property({type: Boolean})
  active = false;

  @property({type: Boolean})
  isFadingIndicator = false;

  @property({type: Boolean})
  minWidth = false;

  @property({type: Boolean})
  isMinWidthIndicator = false;

  @property({type: Boolean})
  isIconIndicator = false;

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

  // TODO(sorvell): is this needed?
  private _handleClick = (e) => {
    this.mdcFoundation.handleClick(e);
    this.active = true;
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
        <span class="mdc-tab__ripple" .ripple="${ripple({interactionNode: this})}"></span>
      </button>`;
  }

  renderIndicator() {
    // TODO(sorvell): indicatorContent is in a <slot>
    const indicatorContent = false;
    return html`<mwc-tab-indicator
        .icon="${indicatorContent}"
        .fade="${this.isFadingIndicator}"
        .active="${this.active}"></mwc-tab-indicator>`;
  }

  createAdapter() {
    return {
      ...super.createAdapter(),
      setAttr: (attr, value) => this.mdcRoot.setAttribute(attr, value),
      activateIndicator: (previousIndicatorClientRect) => (this._tabIndicator as TabIndicator).activate(previousIndicatorClientRect),
      deactivateIndicator: () => (this._tabIndicator as TabIndicator).deactivate(),
      notifyInteracted: () => this.dispatchEvent(
          new CustomEvent(MDCTabFoundation.strings.INTERACTED_EVENT, {
            detail: {tab: this},
            bubbles: true,
            composed: true,
            cancelable: true
          })),
      getOffsetLeft: () => this.mdcRoot.offsetLeft,
      getOffsetWidth: () => this.mdcRoot.offsetWidth,
      getContentOffsetLeft: () => this._contentElement.offsetLeft,
      getContentOffsetWidth: () => this._contentElement.offsetWidth,
      focus: () => this.mdcRoot.focus(),
    }
  }

  activate(clientRect?: DOMRect) {
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

}