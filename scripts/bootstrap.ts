/**
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

import * as fs from 'fs';
import * as path from 'path';

fs.readdirSync(path.join('packages'), {withFileTypes: true})
  .filter(dirEntry => dirEntry.isDirectory())
  .forEach(dirEnt => {

    const name = dirEnt.name;
    const fsPackageLocation = path.join('packages', name);
    const packageJsonLocation = `../../packages/${name}/package.json`;

    const hasPackage = fs.readdirSync(fsPackageLocation, {withFileTypes: true})
      .reduce((prev, curr) => prev || curr.name === 'package.json', false);


    if (!hasPackage) {
      console.warn(`Could not find package.json in ${fsPackageLocation}`);
      return;
    }

    const packageNpmName = require(packageJsonLocation).name as string | undefined;

    if (!packageNpmName) {
      throw new Error(`Could not retrieve name field of ${packageJsonLocation}`);
    }

    const packageNpmNameSplit = packageNpmName.split('/');
    const nodeModulesLocation = path.join('node_modules', ...packageNpmNameSplit);
    const localPackageLocation = path.join(__dirname, '..', '..', 'packages', name);

    try {
      console.log(localPackageLocation, nodeModulesLocation);
      fs.symlinkSync(localPackageLocation, nodeModulesLocation, 'dir');
    } catch (e) {
      console.warn(e);
    }
  });