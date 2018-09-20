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
import {LitElement, html, query, customElement} from '@polymer/lit-element/lit-element.js';
import {MDCTabScrollerFoundation, util} from '@material/tab-scroller';
import {style} from './mwc-tab-scroller-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-scroller': TabScroller;
  }
}

@customElement('mwc-tab-scroller' as any)
export class TabScroller extends LitElement {

  protected mdcFoundation!: MDCTabScrollerFoundation;

  @query('.mdc-tab-scroller')
  protected mdcRoot!: HTMLElement;

  @query('.mdc-tab-scroller__scroll-area')
  protected scrollAreaElement!: HTMLElement;

  @query('.mdc-tab-scroller__scroll-content')
  protected scrollContentElement!: HTMLElement;

  private _handleInteraction = (e) => this.mdcFoundation.handleInteraction(e);

  private _handleTransitionEnd = (e) => this.mdcFoundation.handleTransitionEnd(e);

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div class="mdc-tab-scroller">
        <div class="mdc-tab-scroller__scroll-area"
            @wheel="${this._handleInteraction}"
            @touchstart="${this._handleInteraction}"
            @pointerdown="${this._handleInteraction}"
            @mousedown="${this._handleInteraction}"
            @keydown="${this._handleInteraction}"
            @transitionend="${this._handleTransitionEnd}">
          <div class="mdc-tab-scroller__scroll-content"><slot></slot></div>
        </div>
      </div>
      `;
  }

  firstUpdated() {
    const adapter = {
      eventTargetMatchesSelector: (evtTarget, selector) => {
        const MATCHES = util.getMatchesProperty(HTMLElement.prototype);
        return evtTarget[MATCHES](selector);
      },
      addClass: (className) => this.mdcRoot.classList.add(className),
      removeClass: (className) => this.mdcRoot.classList.remove(className),
      addScrollAreaClass: (className) => this.scrollAreaElement.classList.add(className),
      setScrollAreaStyleProperty: (prop, value) => this.scrollAreaElement.style.setProperty(prop, value),
      setScrollContentStyleProperty: (prop, value) => this.scrollContentElement.style.setProperty(prop, value),
      getScrollContentStyleValue: (propName) => window.getComputedStyle(this.scrollContentElement).getPropertyValue(propName),
      setScrollAreaScrollLeft: (scrollX) => this.scrollAreaElement.scrollLeft = scrollX,
      getScrollAreaScrollLeft: () => this.scrollAreaElement.scrollLeft,
      getScrollContentOffsetWidth: () => this.scrollContentElement.offsetWidth,
      getScrollAreaOffsetWidth: () => this.scrollAreaElement.offsetWidth,
      computeScrollAreaClientRect: () => this.scrollAreaElement.getBoundingClientRect(),
      computeScrollContentClientRect: () => this.scrollContentElement.getBoundingClientRect(),
      computeHorizontalScrollbarHeight: () => util.computeHorizontalScrollbarHeight(document),
    };
    this.mdcFoundation =  new MDCTabScrollerFoundation(adapter);
  }

  /**
   * Returns the current visual scroll position
   * @return {number}
   */
  getScrollPosition() {
    return this.mdcFoundation.getScrollPosition();
  }

  /**
   * Returns the width of the scroll content
   * @return {number}
   */
  getScrollContentWidth() {
    return this.scrollContentElement.offsetWidth;
  }

  /**
   * Increments the scroll value by the given amount
   * @param {number} scrollXIncrement The pixel value by which to increment the scroll value
   */
  incrementScrollPosition(scrollXIncrement: Number) {
    this.mdcFoundation.incrementScroll(scrollXIncrement);
  }

  /**
   * Scrolls to the given pixel position
   * @param {number} scrollX The pixel value to scroll to
   */
  scrollToPosition(scrollX: Number) {
    this.mdcFoundation.scrollTo(scrollX);
  }

}