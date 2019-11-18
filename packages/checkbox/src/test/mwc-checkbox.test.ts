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

import {Checkbox} from '@material/mwc-checkbox';
import {fake} from 'sinon';

interface CheckboxInternals {
  formElement: HTMLInputElement;
}

suite('mwc-checkbox', () => {
  let element: Checkbox;
  let internals: CheckboxInternals;

  setup(() => {
    element = document.createElement('mwc-checkbox');
    internals = element as unknown as CheckboxInternals;
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-checkbox', () => {
    assert.instanceOf(element, Checkbox);
  });


  test('element.formElement returns the native checkbox element', async () => {
    await element.updateComplete;
    assert.instanceOf(internals.formElement, HTMLElement);
    assert.equal(internals.formElement.localName, 'input');
  });

  test(
      'get/set checked updates the checked property on the native checkbox element',
      async () => {
        element.checked = true;
        await element.updateComplete;
        assert.equal(internals.formElement.checked, true);
        element.checked = false;
        await element.updateComplete;
        assert.equal(internals.formElement.checked, false);
      });

  test(
      'get/set indeterminate updates the indeterminate property on the native checkbox element',
      async () => {
        element.indeterminate = true;
        await element.updateComplete;
        assert.equal(internals.formElement.indeterminate, true);
        element.indeterminate = false;
        await element.updateComplete;
        assert.equal(internals.formElement.indeterminate, false);
      });

  test(
      'get/set disabled updates the disabled property on the native checkbox element',
      async () => {
        element.disabled = true;
        await element.updateComplete;
        assert.equal(internals.formElement.disabled, true);
        element.disabled = false;
        await element.updateComplete;
        assert.equal(internals.formElement.disabled, false);
      });

  test(
      'get/set value updates the value of the native checkbox element',
      async () => {
        let value = 'new value';
        element.value = value;
        await element.updateComplete;
        assert.equal(internals.formElement.value, value);
        value = 'new value 2';
        element.value = value;
        await element.updateComplete;
        assert.equal(internals.formElement.value, value);
      });

  test('user input emits `change` event', async () => {
    const callback = fake();
    document.body.addEventListener('change', callback);
    element.checked = false;
    await element.updateComplete;
    element.click();
    assert.equal(callback.callCount, 1);
  });
});
