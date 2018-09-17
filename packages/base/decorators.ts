
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {PropertyValues} from '@polymer/lit-element/lib/updating-element.js';

export interface Observer {
  (value: any, old: any): void;
}

export const observer = (observer: Observer) => (proto: any, propName: PropertyKey) => {
  // if we haven't wrapped `updated` in this class, do so
  if (!proto.constructor._observers) {
    proto.constructor._observers = new Map<PropertyKey, Observer>();
    const userUpdated = proto.updated;
    proto.updated = function(changedProperties: PropertyValues) {
      userUpdated.call(this, changedProperties);
      changedProperties.forEach((v, k) => {
        const observer = this.constructor._observers.get(k);
        if (observer !== undefined) {
          observer.call(this, this[k], v);
        }
      });
    };
  // clone any existing observers (superclasses)
  } else if (!proto.constructor.hasOwnProperty('_observers')) {
    const observers = proto.constructor._observers;
    proto.constructor._observers  = new Map();
    observers.forEach((v: any, k: PropertyKey) => proto.constructor._observers.set(k, v));
  }
  // set this method
  proto.constructor._observers.set(propName, observer);
};

