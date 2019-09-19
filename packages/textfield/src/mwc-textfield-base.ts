/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

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
import '@material/mwc-notched-outline';

import {MDCFloatingLabelFoundation} from '@material/floating-label/foundation.js';
import {MDCLineRippleFoundation} from '@material/line-ripple/foundation.js';
import {addHasRemoveClass, FormElement} from '@material/mwc-base/form-element.js';
import {floatingLabel, FloatingLabel} from '@material/mwc-floating-label';
import {lineRipple, LineRipple} from '@material/mwc-line-ripple';
import {NotchedOutline} from '@material/mwc-notched-outline';
import {MDCTextFieldAdapter, MDCTextFieldInputAdapter, MDCTextFieldLabelAdapter, MDCTextFieldLineRippleAdapter, MDCTextFieldOutlineAdapter, MDCTextFieldRootAdapter} from '@material/textfield/adapter.js';
import {MDCTextFieldCharacterCounterFoundation} from '@material/textfield/character-counter/foundation.js';
import MDCTextFieldFoundation from '@material/textfield/foundation.js';
import {html, property, PropertyValues, query, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {ifDefined} from 'lit-html/directives/if-defined.js';

import {characterCounter, CharacterCounter} from './character-counter/mwc-character-counter-directive.js';

// must be done to get past lit-analyzer checks
declare global {
  interface Element {
    floatingLabelFoundation?: MDCFloatingLabelFoundation;
    lineRippleFoundation?: MDCLineRippleFoundation;
    charCounterFoundation?: MDCTextFieldCharacterCounterFoundation;
  }
}

type CustomValidityState = {
  -readonly[P in keyof ValidityState]: ValidityState[P]
};


const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'mousewheel'];

const createValidityObj =
    (customValidity: Partial<ValidityState> = {}): ValidityState => {
      /*
       * We need to make ValidityState an object because it is readonly and
       * we cannot use the spread operator. Also, we don't export
       * `CustomValidityState` because it is a leaky implementation and the user
       * already has access to `ValidityState` in lib.dom.ts. Also an interface
       * {a: Type} can be casted to {readonly a: Type} so passing any object
       * should be fine.
       */
      const objectifiedCustomValidity: Partial<CustomValidityState> = {};

      // eslint-disable-next-line guard-for-in
      for (const propName in customValidity) {
        /*
         * Casting is needed because ValidityState's props are all readonly and
         * thus cannot be set on `onjectifiedCustomValidity`. In the end, the
         * interface is the same as ValidityState (but not readonly), but the
         * function signature casts the output to ValidityState (thus readonly).
         */
        objectifiedCustomValidity[propName as keyof CustomValidityState] =
            customValidity[propName as keyof ValidityState];
      }

      return {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false,
        ...objectifiedCustomValidity
      };
    };

/**
 * This is the enumerated typeof HTMLInputElement.type as declared by
 * lit-analyzer.
 */
export type TextFieldType = 'text'|'search'|'tel'|'url'|'email'|'password'|
    'date'|'month'|'week'|'time'|'datetime-local'|'number'|'color';

export abstract class TextFieldBase extends FormElement {
  protected mdcFoundation!: MDCTextFieldFoundation;

  protected readonly mdcFoundationClass = MDCTextFieldFoundation;

  @query('.mdc-text-field') protected mdcRoot!: HTMLElement;

  @query('input') protected formElement!: HTMLInputElement;

  @query('.mdc-floating-label') protected labelElement!: FloatingLabel|null;

  @query('.mdc-line-ripple') protected lineRippleElement!: LineRipple|null;

  @query('mwc-notched-outline') protected outlineElement!: NotchedOutline|null;

  @query('.mdc-notched-outline__notch') protected notchElement!: HTMLElement;

  @query('.mdc-text-field-character-counter')
  protected charCounterElement!: CharacterCounter;

  @property({type: String}) value = '';

  @property({type: String}) type: TextFieldType = 'text';

  @property({type: String}) placeholder = '';

  @property({type: String}) label = '';

  @property({type: String}) icon = '';

  @property({type: String}) iconTrailing = '';

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean}) required = false;

  @property({type: Number}) maxLength = -1;

  @property({type: Boolean, reflect: true}) outlined = false;

  @property({type: Boolean, reflect: true}) fullWidth = false;

  @property({type: String}) helper = '';

  @property({type: Boolean}) validateOnInitialRender = false;

  @property({type: String}) validationMessage = '';

  @property({type: String}) pattern = '';

  @property({type: Number}) min: number|string = '';

  @property({type: Number}) max: number|string = '';

  @property({type: Number}) step: number|null = null;

  @property({type: Boolean}) helperPersistent = false;

  @property({type: Boolean}) charCounter = false;

  @property({type: Boolean}) protected outlineOpen = false;
  @property({type: Number}) protected outlineWidth = 0;
  @property({type: Boolean}) protected isUiValid = true;

  protected _validity: ValidityState = createValidityObj();

  get validity(): ValidityState {
    this._checkValidity(this.value);

    return this._validity;
  }

  get willValidate(): boolean {
    return this.formElement.willValidate;
  }

  get selectionStart(): number|null {
    return this.formElement.selectionStart;
  }

  get selectionEnd(): number|null {
    return this.formElement.selectionEnd;
  }

  validityTransform:
      ((value: string,
        nativeValidity: ValidityState) => Partial<ValidityState>)|null = null;

  focus() {
    const focusEvt = new FocusEvent('focus');
    this.formElement.dispatchEvent(focusEvt);
    this.formElement.focus();
  }

  blur() {
    const blurEvt = new FocusEvent('blur');
    this.formElement.dispatchEvent(blurEvt);
    this.formElement.blur();
  }

  select() {
    this.formElement.select();
  }

  setSelectionRange(
      selectionStart: number, selectionEnd: number,
      selectionDirection?: 'forward'|'backward'|'none') {
    this.formElement.setSelectionRange(
        selectionStart, selectionEnd, selectionDirection);
  }

  render() {
    const classes = {
      'mdc-text-field--disabled': this.disabled,
      'mdc-text-field--no-label': !this.label,
      'mdc-text-field--outlined': this.outlined,
      'mdc-text-field--fullwidth': this.fullWidth,
      'mdc-text-field--with-leading-icon': this.icon,
      'mdc-text-field--with-trailing-icon': this.iconTrailing,
    };
    return html`
      <div class="mdc-text-field ${classMap(classes)}">
        ${this.icon ? this.renderIcon(this.icon) : ''}
        ${this.renderInput()}
        ${this.iconTrailing ? this.renderIcon(this.iconTrailing) : ''}
        ${this.outlined ? this.renderOutlined() : this.renderLabelText()}
      </div>
      ${
        (this.helper || this.validationMessage || this.charCounter) ?
            this.renderHelperText() :
            ''}
    `;
  }

  updated(changedProperties: PropertyValues) {
    const charCounter =
        changedProperties.get('charCounter') as boolean | undefined;

    // update foundation only when charCounter goes from false to true
    if (!charCounter && this.charCounter) {
      this.createFoundation();
    }
  }

  protected renderInput() {
    return html`
      <input
          id="text-field"
          class="mdc-text-field__input"
          type="${this.type}"
          .value="${this.value}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          maxlength="${this.maxLength}"
          pattern="${ifDefined(this.pattern ? this.pattern : undefined)}"
          min="${ifDefined(this.min === '' ? undefined : this.min as number)}"
          max="${ifDefined(this.max === '' ? undefined : this.max as number)}"
          step="${ifDefined(this.step === null ? undefined : this.step)}"
          @change="${this.handleInputChange}"
          @blur="${this.onInputBlur}">`;
  }

  protected renderIcon(icon: string) {
    return html`<i class="material-icons mdc-text-field__icon">${icon}</i>`;
  }

  protected renderOutlined() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label) {
      labelTemplate = html`
        <label .floatingLabelFoundation=${floatingLabel()} for="text-field">
          ${this.label}
        </label>
      `;
    }
    return html`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${labelTemplate}
      </mwc-notched-outline>`;
  }

  protected renderLabelText() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label && !this.fullWidth) {
      labelTemplate = html`
      <label .floatingLabelFoundation=${floatingLabel()} for="text-field">
        ${this.label}
      </label>`;
    }

    return html`
      ${labelTemplate}
      <div .lineRippleFoundation=${lineRipple()}></div>
    `;
  }

  protected renderHelperText() {
    const showValidationMessage = this.validationMessage && !this.isUiValid;
    const classes = {
      'mdc-text-field-helper-text--persistent': this.helperPersistent,
      'mdc-text-field-helper-text--validation-msg': showValidationMessage,
    };

    let charCounterTemplate: TemplateResult|string = '';
    if (this.charCounter) {
      charCounterTemplate = html`
        <div .charCounterFoundation=${characterCounter()}></div>`;
    }
    return html`
      <div class="mdc-text-field-helper-line">
        <div class="mdc-text-field-helper-text ${classMap(classes)}">
          ${showValidationMessage ? this.validationMessage : this.helper}
        </div>
        ${charCounterTemplate}
      </div>
    `;
  }

  protected onInputBlur() {
    this.reportValidity();
  }

  checkValidity(): boolean {
    const isValid = this._checkValidity(this.value);

    if (!isValid) {
      const invalidEvent =
          new Event('invalid', {bubbles: false, cancelable: true});
      this.dispatchEvent(invalidEvent);
    }

    return isValid;
  }

  reportValidity(): boolean {
    const isValid = this.checkValidity();

    this.mdcFoundation.setValid(isValid);
    this.isUiValid = isValid;

    return isValid;
  }

  protected _checkValidity(value: string) {
    const nativeValidity = this.formElement.validity;

    let validity = createValidityObj(nativeValidity);

    if (this.validityTransform) {
      const customValidity = this.validityTransform(value, validity);
      validity = {...validity, ...customValidity};
      this.mdcFoundation.setUseNativeValidation(false);
    } else {
      this.mdcFoundation.setUseNativeValidation(true);
    }

    this._validity = validity;

    return this._validity.valid;
  }

  setCustomValidity(message: string) {
    this.validationMessage = message;
    this.formElement.setCustomValidity(message);
  }

  protected handleInputChange() {
    this.value = this.formElement.value;
  }

  protected createFoundation() {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.destroy();
    }
    this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter(), {
      characterCounter: this.charCounterElement ?
          this.charCounterElement.charCounterFoundation :
          undefined
    });
    this.mdcFoundation.init();
  }

  protected createAdapter(): MDCTextFieldAdapter {
    return {
      ...this.getRootAdapterMethods(),
      ...this.getInputAdapterMethods(),
      ...this.getLabelAdapterMethods(),
      ...this.getLineRippleAdapterMethods(),
      ...this.getOutlineAdapterMethods(),
    };
  }

  protected getRootAdapterMethods(): MDCTextFieldRootAdapter {
    return {
      registerTextFieldInteractionHandler: (evtType, handler) =>
          this.addEventListener(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType, handler) =>
          this.removeEventListener(evtType, handler),
      registerValidationAttributeChangeHandler: (handler) => {
        const getAttributesList =
            (mutationsList: MutationRecord[]): string[] => {
              return mutationsList.map((mutation) => mutation.attributeName)
                         .filter((attributeName) => attributeName) as string[];
            };
        const observer = new MutationObserver(
            (mutationsList) => handler(getAttributesList(mutationsList)));
        const config = {attributes: true};
        observer.observe(this.formElement, config);
        return observer;
      },
      deregisterValidationAttributeChangeHandler:
          (observer: MutationObserver) => observer.disconnect(),
      ...addHasRemoveClass(this.mdcRoot),
    };
  }

  protected getInputAdapterMethods(): MDCTextFieldInputAdapter {
    return {
      getNativeInput: () => this.formElement,
      isFocused: () => this.shadowRoot ?
          this.shadowRoot.activeElement === this.formElement :
          false,
      registerInputInteractionHandler: (evtType, handler) =>
          this.formElement.addEventListener(
              evtType, handler, {passive: evtType in passiveEvents}),
      deregisterInputInteractionHandler: (evtType, handler) =>
          this.formElement.removeEventListener(evtType, handler),
    };
  }

  protected getLabelAdapterMethods(): MDCTextFieldLabelAdapter {
    return {
      floatLabel: (shouldFloat: boolean) => this.labelElement &&
          this.labelElement.floatingLabelFoundation.float(shouldFloat),
      getLabelWidth: () => {
        return this.labelElement ?
            this.labelElement.floatingLabelFoundation.getWidth() :
            0;
      },
      hasLabel: () => Boolean(this.labelElement),
      shakeLabel: (shouldShake: boolean) => this.labelElement &&
          this.labelElement.floatingLabelFoundation.shake(shouldShake),
    };
  }

  protected getLineRippleAdapterMethods(): MDCTextFieldLineRippleAdapter {
    return {
      activateLineRipple: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.activate();
        }
      },
      deactivateLineRipple: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.deactivate();
        }
      },
      setLineRippleTransformOrigin: (normalizedX: number) => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.setRippleCenter(
              normalizedX);
        }
      },
    };
  }

  async firstUpdated() {
    const outlineElement = this.outlineElement;
    if (outlineElement) {
      await outlineElement.updateComplete;
    }

    super.firstUpdated();

    if (this.validateOnInitialRender) {
      this.reportValidity();
    }
  }

  protected getOutlineAdapterMethods(): MDCTextFieldOutlineAdapter {
    return {
      closeOutline: () => this.outlineElement && (this.outlineOpen = false),
      hasOutline: () => Boolean(this.outlineElement),
      notchOutline: (labelWidth) => {
        const outlineElement = this.outlineElement;
        if (outlineElement) {
          this.outlineWidth = labelWidth;
          this.outlineOpen = true;
        }
      }
    };
  }
}
