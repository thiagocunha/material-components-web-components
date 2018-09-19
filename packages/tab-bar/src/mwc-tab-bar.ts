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
import {MDCTabBarFoundation} from '@material/tab-bar';
import {style} from './mwc-tab-bar-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-bar': TabBar;
  }
}

@customElement('mwc-tab-bar' as any)
export class TabBar extends LitElement {

  private _foundation: MDCTabBarFoundation;

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      `;
  }

}