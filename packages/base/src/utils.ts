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

/**
 * Return an element assigned to a given slot that matches the given selector
 */
export function findAssignedElement(slot: HTMLSlotElement, selector: string) {
  for (const node of slot.assignedNodes({flatten: true})) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = (node as HTMLElement);
      if (el.matches(selector)) {
        return el;
      }
    }
  }

  return null;
}

export type Constructor<T> = new (...args: any[]) => T;

export function addHasRemoveClass(element: HTMLElement) {
  return {
    addClass: (className: string) => {
      element.classList.add(className);
    },
    removeClass: (className: string) => {
      element.classList.remove(className);
    },
    hasClass: (className: string) => element.classList.contains(className),
  };
}

/**
 * Event listeners suport `passive` option
 */
export let supportsPassiveEventListener = false;
/**
 * Event listeners support `once` option
 */
export let supportsOnceEventListener = false;
/**
 * Event listeners suport `capture` option
 */
export let supportsCaptureEventListener = false;

(() => {
  const fn = ()=>{};
  const optionsBlock: AddEventListenerOptions = {
    get passive() {
      supportsPassiveEventListener = true;
      return false;
    },
    get capture() {
      supportsCaptureEventListener = true;
      return false;
    },
    get once() {
      supportsOnceEventListener = true;
      return false;
    }
  };
  document.addEventListener('x', fn, optionsBlock);
  document.removeEventListener('x', fn);
})();
