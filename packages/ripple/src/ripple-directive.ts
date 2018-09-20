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
import {directive, PropertyPart} from 'lit-html/lit-html.js';
import {MDCRippleFoundation} from '@material/ripple/index.js';
import * as util from '@material/ripple/util.js';

const MATCHES = util.getMatchesProperty(HTMLElement.prototype);

const supportsCssVariables = util.supportsCssVariables(window);

type Handler = EventListenerOrEventListenerObject;

interface RippleOptions {
  interactionNode?: HTMLElement;
  unbounded?: boolean;
  disabled?: boolean;
  active?: boolean;
}

const rippleParts = new WeakMap();

export const ripple = (rippleOptions: RippleOptions = {}) => directive((part: PropertyPart) =>{
  const rippleSurface = part.committer.element as HTMLElement;

  // Note, these may become rippleOptions.
  const interactionNode = rippleOptions.interactionNode || rippleSurface;

  const rippleFoundation = rippleParts.get(rippleSurface);
  if (rippleFoundation === undefined) {
    const adapter = {
      browserSupportsCssVars: () => supportsCssVariables,
      isUnbounded: () =>
        rippleOptions.unbounded === undefined ? true : rippleOptions.unbounded,
      isSurfaceActive: () => interactionNode![MATCHES](':active'),
      isSurfaceDisabled: () => Boolean(rippleOptions.disabled),
      addClass: (className: string) => rippleSurface!.classList.add(className),
      removeClass: (className: string) =>
        rippleSurface!.classList.remove(className),
      containsEventTarget: (target: HTMLElement) => interactionNode.contains(target),
      registerInteractionHandler: (type: string, handler: Handler) =>
        interactionNode!.addEventListener(type, handler, util.applyPassive()),
      deregisterInteractionHandler: (type: string, handler: Handler) =>
        interactionNode!.removeEventListener(type, handler, util.applyPassive()),
      registerDocumentInteractionHandler: (evtType: string, handler: Handler) =>
        document.documentElement.addEventListener(
            evtType, handler, util.applyPassive()),
      deregisterDocumentInteractionHandler: (evtType: string, handler: Handler) =>
        document.documentElement.removeEventListener(
            evtType, handler, util.applyPassive()),
      registerResizeHandler: (handler: Handler) =>
        window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler: Handler) =>
        window.removeEventListener('resize', handler),
      updateCssVariable: (varName: string, value: string) =>
        rippleSurface!.style.setProperty(varName, value),
      computeBoundingRect: () => rippleSurface!.getBoundingClientRect(),
      getWindowPageOffset: () => ({x: window.pageXOffset, y: window.pageYOffset}),
    };
    const foundation = new MDCRippleFoundation(adapter);
    part.setValue(foundation);
    rippleParts.set(rippleSurface, foundation);
  } else {
    if (rippleOptions.unbounded !== undefined) {
      rippleFoundation.setUnbounded(rippleOptions.unbounded);
    }
    if (rippleOptions.disabled !== undefined) {
      rippleFoundation.setUnbounded(rippleOptions.disabled);
    }
  }
  if (rippleOptions.active === true) {
    rippleFoundation.activate();
  } else if (rippleOptions.active === false) {
    rippleFoundation.deactivate();
  }
});