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
import {BaseElement, html, property, observer, query, customElement, Adapter, Foundation} from '@material/mwc-base/base-element.js';
import {style} from './mwc-linear-progress-css.js';
import MDCLinearProgressFoundation from '@material/linear-progress/foundation.js';

const {PRIMARY_BAR_SELECTOR, BUFFER_SELECTOR} = MDCLinearProgressFoundation.strings;

export interface LinearProgressFoundation extends Foundation {
  setDeterminate(value: boolean): void;
  setProgress(value: number): void;
  setBuffer(value: number): void;
  setReverse(value: boolean): void;
  open(): void;
  close(): void;
}

export declare var LinearProgressFoundation: {
  prototype: LinearProgressFoundation;
  new(adapter: Adapter): LinearProgressFoundation;
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-linear-progress': LinearProgress;
  }
}

@customElement('mwc-linear-progress' as any)
export class LinearProgress extends BaseElement {
  protected mdcFoundation!: LinearProgressFoundation;

  protected readonly mdcFoundationClass: typeof LinearProgressFoundation = MDCLinearProgressFoundation;

  @query('.mdc-linear-progress')
  protected mdcRoot!: HTMLElement

  @query(PRIMARY_BAR_SELECTOR)
  protected primaryBar!: HTMLElement

  @query(BUFFER_SELECTOR)
  protected bufferElement!: HTMLElement

  @property({type: Boolean})
  @observer(function(this: LinearProgress, value: boolean) {
    this.mdcFoundation.setDeterminate(value);
  })
  determinate = false;

  @property({type: Number})
  @observer(function(this: LinearProgress, value: number) {
    this.mdcFoundation.setProgress(value);
  })
  progress = 0;

  @property({type: Number})
  @observer(function(this: LinearProgress, value: number) {
    this.mdcFoundation.setBuffer(value);
  })
  buffer = 0;

  @property({type: Boolean})
  @observer(function(this: LinearProgress, value: boolean) {
    this.mdcFoundation.setReverse(value);
  })
  reverse = 0;

  @observer(function(this: LinearProgress, value: boolean) {
    if (value) {
      this.mdcFoundation.close();
    } else {
      this.mdcFoundation.open();
    }
  })
  @property({type: Boolean, reflect: true})
  closed = false;

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div role="progressbar" class="mdc-linear-progress">
        <div class="mdc-linear-progress__buffering-dots"></div>
        <div class="mdc-linear-progress__buffer"></div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>`;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      getPrimaryBar: () => this.primaryBar,
      getBuffer: () => this.bufferElement,
      setStyle: (el: HTMLElement, property: string, value: string) => el.style[property] = value,
    };
  }

  open() {
    this.closed = false;
  }

  close() {
    this.closed = true;
  }
}
