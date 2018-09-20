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
import {LitElement, html, query, property, customElement} from '@polymer/lit-element/lit-element.js';
import {classMap} from 'lit-html/directives/classMap.js';
import {observer} from '@material/mwc-base/decoractors.js';
import {MDCSlidingTabIndicatorFoundation, MDCFadingTabIndicatorFoundation} from '@material/tab-indicator';
import {style} from './mwc-tab-indicator-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-indicator': TabIndicator;
  }
}

@customElement('mwc-tab-indicator' as any)
export class TabIndicator extends LitElement {

  private mdcFoundation!: MDCSlidingTabIndicatorFoundation|MDCFadingTabIndicatorFoundation;

  @query('.mdc-tab-indicator')
  protected mdcRoot!: HTMLElement;

  @query('.mdc-tab-indicator__content')
  protected contentElement!: HTMLElement;

  @property()
  icon = '';

  @observer(function(value) {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.destroy();
    }
    const adapter = {
      addClass: (className) => this.mdcRoot.classList.add(className),
      removeClass: (className) => this.mdcRoot.classList.remove(className),
      computeContentClientRect: () => this.contentElement.getBoundingClientRect(),
      setContentStyleProperty: (prop, value) => this.contentElement.style.setProperty(prop, value)
    };
    const Foundation = value ? MDCFadingTabIndicatorFoundation : MDCSlidingTabIndicatorFoundation;
    this.mdcFoundation = new Foundation(adapter);
  })
  @property({type: Boolean})
  fade = false;


  // TODO(sorvell): may not work without clientRect in activate?
  // private _previousIndicatorClientRect: DOMRect|undefined;
  @observer(function(value) {
    if (value) {
      this.activate();
    } else {
      this.deactivate();
    }
  })
  @property({type: Boolean})
  active = false;

  renderStyle() {
    return style;
  }

  render() {
    const contentClasses = {
      'mdc-tab-indicator__content--icon': this.icon,
      'mdc-tab-indicator__content--underline': !this.icon
    };
    return html`
      ${this.renderStyle()}
      <span class="mdc-tab-indicator ${classMap({'mdc-tab-indicator--fade': this.fade})}">
        <span class="mdc-tab-indicator__content ${classMap(contentClasses)}">${this.icon}</span>
      </span>
      `;
  }

  computeContentClientRect() {
    return this.mdcFoundation.computeContentClientRect();
  }

  activate(previousIndicatorClientRect) {
    this.mdcFoundation.activate(previousIndicatorClientRect);
  }

  deactivate() {
    this.mdcFoundation.deactivate();
  }

}