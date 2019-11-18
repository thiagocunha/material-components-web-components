/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {Switch} from '@material/mwc-switch';
import {fake} from 'sinon';

interface SwitchInternals {
  formElement: HTMLInputElement;
}

suite('mwc-switch', () => {
  let element: Switch;
  let internals: SwitchInternals;

  setup(() => {
    element = document.createElement('mwc-switch');
    internals = element as unknown as SwitchInternals;
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-switch', () => {
    assert.instanceOf(element, Switch);
  });

  test('setting `checked` checks the native input', async () => {
    element.checked = true;
    await element.updateComplete;
    assert(internals.formElement.checked);

    element.checked = false;
    await element.updateComplete;
    assert(!internals.formElement.checked);
  });

  test('setting `disabled` disables the native input', async () => {
    element.disabled = true;
    await element.updateComplete;
    assert(internals.formElement.disabled);

    element.disabled = false;
    await element.updateComplete;
    assert(!internals.formElement.disabled);
  });

  test('user input emits `change` event', async () => {
    const callback = fake();
    document.body.addEventListener('change', callback);
    element.checked = false;
    await element.updateComplete;

    element.click();

    assert.equal(callback.callCount, 1);

    document.body.removeEventListener('change', callback);
  });
});
