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

import * as cp from 'child_process'
import * as find from 'find';
import * as path from 'path';

const search = (/tsconfig\.json$/ as unknown) as string;
const tsConfigs = find.fileSync(search, path.join(__dirname, '..', '..', 'packages'));
const args = process.argv.slice(2).join(' ');

for (const tsconfig of tsConfigs) {
  cp.exec(`npm run tsc -- -b ${tsconfig} ${args}`, (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    if (err) {
      process.exit(1);
    }
  });
}