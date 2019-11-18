/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {cssClasses as floatingClasses} from '@material/floating-label/constants';
import {FloatingLabel} from '@material/mwc-floating-label';
import {TextField} from '@material/mwc-textfield';
import {cssClasses} from '@material/textfield/constants';
import {html} from 'lit-html';

import {fixture, rafPromise, TestFixture} from '../../../../test/src/util/helpers';

interface TextfieldInternals {
  createFoundation: () => void;
}

const basic = html`
  <mwc-textfield></mwc-textfield>
`;

const validationRequired = html`
  <mwc-textfield label="I am required" required></mwc-textfield>
`;

const validationPattern = html`
  <mwc-textfield pattern="[0-9]+" value="dogs"></mwc-textfield>
`;

const reqInitialVal = html`
  <mwc-textfield
      label="I am required"
      required
      validateOnInitialRender>
  </mwc-textfield>
`;

const makeOutlined = (isHidden: boolean) => html`
  <style>
    .hidden {
      display: none;
    }
  </style>
  <mwc-textfield
      outlined
      label="label"
      class="${isHidden ? 'hidden' : ''}"
      value="some value to notch label">
  </mwc-textfield>
`;

const withLabel = html`
  <mwc-textfield label="a label"></mwc-textfield>
`;

const isUiInvalid = (element: TextField) => {
  return !!element.shadowRoot!.querySelector(`.${cssClasses.INVALID}`);
};

suite('mwc-textfield:', () => {
  let fixt: TestFixture;

  suite('basic', () => {
    let element: TextField;
    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textfield')!;
    });

    test('initializes as an mwc-textfield', () => {
      assert.instanceOf(element, TextField);
    });

    test('setting value sets on input', async () => {
      element.value = 'my test value';

      const inputElement = element.shadowRoot!.querySelector('input');
      assert(inputElement, 'my test value');
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('validation', () => {
    test('required invalidates on blur', async () => {
      fixt = await fixture(validationRequired);
      const element = fixt.root.querySelector('mwc-textfield')!;

      assert.isFalse(isUiInvalid(element));
      element.focus();
      element.blur();
      assert.isTrue(isUiInvalid(element));
    });

    test('validity & checkValidity do not trigger ui', async () => {
      fixt = await fixture(validationPattern);
      const element = fixt.root.querySelector('mwc-textfield')!;

      assert.isFalse(isUiInvalid(element));

      let invalidCalled = false;
      element.addEventListener('invalid', () => invalidCalled = true);

      const validity = element.validity;

      assert.isTrue(validity.patternMismatch);
      assert.isFalse(validity.valid);
      assert.isFalse(invalidCalled);
      assert.isFalse(isUiInvalid(element));

      const checkValidity = element.checkValidity();

      assert.isFalse(checkValidity);
      assert.isTrue(invalidCalled);
      assert.isFalse(isUiInvalid(element));
    });

    test('setCustomValidity', async () => {
      fixt = await fixture(basic);
      const element = fixt.root.querySelector('mwc-textfield')!;

      assert.isFalse(isUiInvalid(element));
      assert.equal(element.validationMessage, '');

      const validationMsgProp = 'set on prop';
      element.validationMessage = validationMsgProp;
      assert.isFalse(isUiInvalid(element));
      assert.equal(element.validationMessage, validationMsgProp);

      const validationMsgFn = 'set by setCustomValidity';
      element.setCustomValidity(validationMsgFn);

      assert.equal(element.validationMessage, validationMsgFn);

      const validity = element.validity;
      assert.isTrue(validity.customError);
      assert.isFalse(validity.valid);
    });

    test('validity transform', async () => {
      fixt = await fixture(validationPattern);
      const element = fixt.root.querySelector('mwc-textfield')!;

      assert.isFalse(element.checkValidity());

      const transformFn =
          (value: string, vState: ValidityState): Partial<ValidityState> => {
            if (value.indexOf('dogs') !== -1) {
              return {
                valid: true,
              };
            } else if (vState.valid) {
              const numberifiedValue = Number(value);
              if (numberifiedValue > 5) {
                return {
                  valid: false,
                  rangeOverflow: true,
                };
              }
            }

            return {};
          };

      element.validityTransform = transformFn;

      let validity = element.validity;
      // true because dogs
      assert.isTrue(validity.valid);
      assert.isTrue(validity.patternMismatch);
      assert.isTrue(element.checkValidity());

      element.value = '6';
      await element.updateComplete;
      validity = element.validity;
      // false because > 5
      assert.isFalse(validity.valid);
      assert.isTrue(validity.rangeOverflow);
      assert.isFalse(element.reportValidity());

      assert.isTrue(isUiInvalid(element));

      element.value = '1';
      await element.updateComplete;
      validity = element.validity;
      // true because < 5
      assert.isTrue(validity.valid);
      assert.isFalse(validity.patternMismatch);
      assert.isFalse(validity.rangeOverflow);
      assert.isTrue(element.reportValidity());

      assert.isFalse(isUiInvalid(element));
    });

    test('initial validation', async () => {
      fixt = await fixture(reqInitialVal);
      let element = fixt.root.querySelector('mwc-textfield')!;
      assert.isTrue(isUiInvalid(element));

      fixt.remove();

      fixt = await fixture(validationRequired);
      element = fixt.root.querySelector('mwc-textfield')!;
      assert.isFalse(isUiInvalid(element));
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });


  suite('select', () => {
    let element: TextField;

    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textfield')!;
    });

    test('selects the input text', () => {
      const input = element.shadowRoot!.querySelector('input')!;

      input.value = 'foobar';

      element.select();

      assert.equal(input.selectionStart, 0);
      assert.equal(input.selectionEnd, 6);
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('setSelectionRange', () => {
    let element: TextField;

    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textfield')!;
    });

    test('sets correct selection', async () => {
      const input = element.shadowRoot!.querySelector('input')!;

      element.value = 'one two three';
      await element.updateComplete;

      element.setSelectionRange(4, 6);

      assert.equal(input.selectionStart, 4);
      assert.equal(input.selectionEnd, 6);
      assert.equal(element.selectionStart, 4);
      assert.equal(element.selectionEnd, 6);
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('notch', () => {
    let fixt: TestFixture;
    test('notch can be layout-ed to correct size', async () => {
      fixt = await fixture(makeOutlined(true));
      const element = fixt.root.querySelector('mwc-textfield')!;

      const notchedOutline =
          element.shadowRoot!.querySelector('mwc-notched-outline')!;
      const floatingLabel =
          element.shadowRoot!.querySelector('label') as FloatingLabel;

      await element.requestUpdate();
      // needed for older browsers
      await notchedOutline.requestUpdate();

      let outlineWidth = notchedOutline.width;
      assert.isTrue(notchedOutline.open);

      assert.strictEqual(outlineWidth, 0);

      element.classList.remove('hidden');
      await element.requestUpdate();
      await rafPromise();
      outlineWidth = notchedOutline.width;
      let labelWidth = floatingLabel.floatingLabelFoundation.getWidth();
      assert.strictEqual(outlineWidth, 0);
      assert.isTrue(labelWidth > 0);

      await element.layout();
      await element.updateComplete;

      outlineWidth = notchedOutline.width;
      labelWidth = floatingLabel.floatingLabelFoundation.getWidth();

      const diff = Math.abs(outlineWidth - labelWidth);
      assert.isTrue(diff < 3);
    });

    test('notch changes size with label change', async () => {
      fixt = await fixture(makeOutlined(false));
      const element = fixt.root.querySelector('mwc-textfield')!;

      const notchedOutline =
          element.shadowRoot!.querySelector('mwc-notched-outline')!;
      const floatingLabel =
          element.shadowRoot!.querySelector('label') as FloatingLabel;
      await element.requestUpdate();
      // needed for older browsers
      await notchedOutline.requestUpdate();

      let outlineWidth = notchedOutline.width;
      let labelWidth = floatingLabel.floatingLabelFoundation.getWidth();
      assert.isTrue(notchedOutline.open);
      let diff = Math.abs(outlineWidth - labelWidth);
      assert.isTrue(diff < 3);

      element.label = 'this is some other label';

      // wait for this label to finish updating
      await element.updateComplete;
      // wait for internal event listener to trigger layout method
      await element.requestUpdate();
      // needed for older browsers
      await notchedOutline.requestUpdate();

      outlineWidth = notchedOutline.width;
      labelWidth = floatingLabel.floatingLabelFoundation.getWidth();
      diff = Math.abs(outlineWidth - labelWidth);
      assert.isTrue(diff < 3);
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('helper and char counter rendering', () => {
    let fixt: TestFixture;

    setup(async () => {
      fixt = await fixture(basic);
    });

    test('createFoundation called an appropriate amount of times', async () => {
      const element = fixt.root.querySelector('mwc-textfield')!;
      const internals = element as unknown as TextfieldInternals;
      element.helperPersistent = true;

      const oldCreateFoundation =
          internals.createFoundation.bind(element) as () => void;
      let numTimesCreateFoundationCalled = 0;

      internals.createFoundation = () => {
        numTimesCreateFoundationCalled = numTimesCreateFoundationCalled + 1;
        oldCreateFoundation();
      };

      const charCounters = element.shadowRoot!.querySelectorAll(
          '.mdc-text-field-character-counter');

      assert.strictEqual(charCounters.length, 1, 'only one char counter');

      const charCounter = charCounters[0] as HTMLElement;
      const helperText = element.shadowRoot!.querySelector(
                             '.mdc-text-field-helper-text') as HTMLElement;


      assert.strictEqual(
          charCounter.offsetWidth, 0, 'char counter initially hidden');
      assert.strictEqual(
          helperText.offsetWidth, 0, 'helper line initially hidden');

      element.helper = 'my helper';
      await element.requestUpdate();

      assert.strictEqual(
          numTimesCreateFoundationCalled,
          0,
          'foundation not recreated due to helper change');
      assert.strictEqual(
          charCounter.offsetWidth,
          0,
          'char counter hidden when only helper defined');
      assert.isTrue(
          helperText.offsetWidth > 0, 'helper text shown when defined');

      element.helper = '';
      await element.requestUpdate();

      assert.strictEqual(
          numTimesCreateFoundationCalled,
          0,
          'foundation not recreated due to helper change');
      assert.strictEqual(
          charCounter.offsetWidth,
          0,
          'char counter does not render on helper change');
      assert.strictEqual(
          helperText.offsetWidth, 0, 'helper line hides when reset to empty');

      element.maxLength = 10;
      await element.requestUpdate();

      assert.strictEqual(
          numTimesCreateFoundationCalled,
          1,
          'foundation created when maxlength changed from -1');
      assert.strictEqual(
          charCounter.offsetWidth,
          0,
          'char counter does not render without charCounter set');
      assert.strictEqual(
          helperText.offsetWidth,
          0,
          'helper line does not render on maxLength change');

      numTimesCreateFoundationCalled = 0;
      element.maxLength = -1;
      await element.requestUpdate();

      assert.strictEqual(
          numTimesCreateFoundationCalled,
          1,
          'foundation created when maxlength changed to -1');

      numTimesCreateFoundationCalled = 0;
      element.charCounter = true;
      await element.requestUpdate();

      assert.strictEqual(
          numTimesCreateFoundationCalled,
          0,
          'foundation not updated when charCounter changed');
      assert.strictEqual(
          charCounter.offsetWidth,
          0,
          'char counter does not render without maxLength set');
      assert.strictEqual(
          helperText.offsetWidth,
          0,
          'helper line does not render on charCounter change');

      element.maxLength = 20;
      await element.requestUpdate();

      assert.strictEqual(
          numTimesCreateFoundationCalled,
          1,
          'foundation created when maxlength changed from -1');
      assert.isTrue(
          charCounter.offsetWidth > 0,
          'char counter renders when both charCounter and maxLength set');

      numTimesCreateFoundationCalled = 0;
      element.maxLength = 15;
      await element.requestUpdate();

      assert.strictEqual(
          numTimesCreateFoundationCalled,
          0,
          'foundation not recreated when maxLength not changed to or from -1');
      assert.isTrue(
          charCounter.offsetWidth > 0,
          'char counter still visible on maxLength change');
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('label', () => {
    let element: TextField;

    setup(async () => {
      fixt = await fixture(withLabel);
      element = fixt.root.querySelector('mwc-textfield')!;
      await element.updateComplete;
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });

    test('label floats when value is set', async () => {
      const floatingLabel =
          element.shadowRoot!.querySelector('label') as FloatingLabel;

      assert.isFalse(
          floatingLabel.classList.contains(floatingClasses.LABEL_FLOAT_ABOVE));

      element.value = 'foo bar';
      await element.updateComplete;

      assert.isTrue(
          floatingLabel.classList.contains(floatingClasses.LABEL_FLOAT_ABOVE));
    });
  });
});
