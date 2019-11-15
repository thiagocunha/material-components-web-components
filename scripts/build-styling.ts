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
import * as path from 'path';
import * as find from 'find';
import * as fs from 'fs';
import * as util from 'util';
import * as sass from 'sass';
const nodeSassImport = require('node-sass-import');

const search = (/.*.scss$/ as unknown) as string;
const sassFiles = find.fileSync(search, path.join(__dirname, '..', '..', 'packages'));

const renderSass = util.promisify(sass.render);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const delim = /<%\s*content\s*%>/;

async function sassToCss(sassFile: string) {
  const result = await renderSass({
    file: sassFile,
    importer: nodeSassImport,
    outputStyle: 'compressed',
  });
  return result.css.toString();
}

async function sassRender(sourceFile: string, templateFile: string, outputFile: string) {
  const template = await readFile(templateFile, 'utf-8');
  const match = delim.exec(template);
  if (!match) {
    throw new Error(`Template file ${templateFile} did not contain template delimiters`);
  }
  const replacement = await sassToCss(sourceFile);
  const newContent = template.replace(delim, replacement);
  return writeFile(outputFile, newContent, 'utf-8');
}

for (const sassFile of sassFiles) {
  const outFile = sassFile.replace(/\.scss$/, '-css.ts');
  sassRender(sassFile, 'sass-template.tmpl', outFile);
}