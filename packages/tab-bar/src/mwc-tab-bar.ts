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
import {TabScroller} from '@material/mwc-tab-scroller/mwc-tab-scroller.js';
import {Tab} from '@material/mwc-tab/mwc-tab.js';
import {observer} from '@material/mwc-base/decoractors.js';
import {classMap} from 'lit-html/directives/classMap.js';
import {MDCTabBarFoundation} from '@material/tab-bar';
import {style} from './mwc-tab-bar-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-bar': TabBar;
  }
}

@customElement('mwc-tab-bar' as any)
export class TabBar extends LitElement {

  protected mdcFoundation!: MDCTabBarFoundation;

  @query('.mdc-tab-bar')
  protected mdcRoot!: HTMLElement

  @query('mwc-tab-scroller')
  protected scrollerElement!: TabScroller

  @query('slot')
  protected tabsSlot!: HTMLSlotElement

  @observer(function(value) {
    this.mdcFoundation.activateTab(value);
  })
  @property({type: Number})
  activeIndex = 0;

  private _handleTabInteraction = (e) => this.mdcFoundation.handleTabInteraction(e);

  private _handleKeydown = (e) => this.mdcFoundation.handleKeyDown(e);

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div class="mdc-tab-bar" role="tablist"
          @MDCTab:interacted="${this._handleTabInteraction}"
          @keydown="${this._handleKeydown}">
        <mwc-tab-scroller><slot></slot></mwc-tab-scroller>
      </div>
      `;
  }

  private _getTabs(): Array<Tab> {
    return this.tabsSlot.assignedNodes({flatten: true});
  }

  firstUpdated() {
    const adapter = {
      scrollTo: (scrollX) => this.scrollerElement.scrollTo(scrollX),
      incrementScroll: (scrollXIncrement) => this.scrollerElement.incrementScrollPosition(scrollXIncrement),
      getScrollPosition: () => this.scrollerElement.getScrollPosition(),
      getScrollContentWidth: () => this.scrollerElement.getScrollContentWidth(),
      getOffsetWidth: () => this.mdcRoot.offsetWidth,
      isRTL: () => window.getComputedStyle(this.mdcRoot).getPropertyValue('direction') === 'rtl',
      setActiveTab: (index) => this.mdcFoundation.activateTab(index),
      activateTabAtIndex: (index, clientRect) => this._getTabs()[index].activate(clientRect),
      deactivateTabAtIndex: (index) => this._getTabs()[index].deactivate(),
      focusTabAtIndex: (index) => this._getTabs()[index].focus(),
      getTabIndicatorClientRectAtIndex: (index) => this._getTabs()[index].computeIndicatorClientRect(),
      getTabDimensionsAtIndex: (index) => this._getTabs()[index].computeDimensions(),
      getPreviousActiveTabIndex: () => {
        const tabs = this._getTabs();
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].active) {
            return i;
          }
        }
        return -1;
      },
      getFocusedTabIndex: () => {
        const tabElements = this._getTabs();
        const activeElement = (this as any).getRootNode().activeElement;
        return tabElements.indexOf(activeElement);
      },
      getIndexOfTab: (tabToFind) => this._getTabs().indexOf(tabToFind),
      getTabListLength: () => this._getTabs().length,
      notifyTabActivated: (index) => this.dispatchEvent(
          new CustomEvent(MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT,
          {detail: {index}, bubbles: true, cancelable: true}))
    };
    this.mdcFoundation =  new MDCTabBarFoundation(adapter);
    // TODO(sorvell): seems dubious that you can specify activeIndex OR active on a tab...
    const tabs = this._getTabs();
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].active) {
        this.activeIndex = i;
        break;
      }
    }
  }

  scrollIndexIntoView(index: Number) {
    this.mdcFoundation.scrollIntoView(index);
  }

}