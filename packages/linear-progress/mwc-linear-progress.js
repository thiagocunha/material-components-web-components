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
import {ComponentElement, MDCWebComponentMixin, html} from '@material/mwc-base/component-element.js';
import {style} from './mwc-linear-progress-css.js';
import {MDCLinearProgress} from '@material/linear-progress';

export class MDCWCLinearProgress extends MDCWebComponentMixin(MDCLinearProgress) {}

export class LinearProgress extends ComponentElement {
  static get ComponentClass() {
    return MDCWCLinearProgress;
  }

  static get componentSelector() {
    return '.mdc-linear-progress';
  }

  static get properties() {
    return {
      determinate: {type: Boolean},
      progress: {type: Number},
      buffer: {type: Number},
      reverse: {type: Boolean},
      closed: {type: Boolean},
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.determinate = false;
    this.progress = 0;
    this.buffer = 0;
    this.reverse = false;
    this.closed = false;
  }

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

  async update(changedProperties) {
    if (changedProperties.has('determinate')) {
      await this.componentReady();
      this._component.determinate = props.determinate;
    }
    if (changedProperties.has('progress')) {
      await this.componentReady();
      this._component.progress = props.progress;
    }
    if (changedProperties.has('buffer')) {
      await this.componentReady();
      this._component.buffer = props.buffer;
    }
    if (changedProperties.has('reverse')) {
      await this.componentReady();
      this._component.reverse = props.reverse;
    }
    if (changedProperties.has('closed')) {
      if (props.closed) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  open() {
    this.componentReady().then((component) => {
      component.open();
    });
  }

  close() {
    this.componentReady().then((component) => {
      component.close();
    });
  }
}

customElements.define('mwc-linear-progress', LinearProgress);
