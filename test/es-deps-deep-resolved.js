/* eslint-disable no-multi-spaces */
import test from 'ava';
import esDepsDeepResolved from '../src/es-deps-deep-resolved';
import { join } from 'path';

const { cwd } = process;
const joinCwd = filename => join(cwd(), 'fixtures', 'graph', filename);

const expected = {
  basic: [
    {
      requested: './first/index.js',
      resolved: joinCwd('./basic/first/index.js'),
      from: joinCwd('./basic/index.js'),
      children: [
        {
          requested: './second/index.js',
          resolved: joinCwd('./basic/first/second/index.js'),
          from: joinCwd('./basic/first/index.js'),
          children: []
        }
      ]
    }
  ],
  basicPlus: [
    { filename: './index.js',                    importedAs: '' },
    { filename: './first/index.js',              importedAs: './first/index.js' },
    { filename: './first/second/index.js',       importedAs: '' },
    { filename: './first/second/three/index.js', importedAs: '' },
  ],
  extended: [
    { filename: './index.js', importedAs: '' },
    { filename: './first/index.js', importedAs: '' },
    { filename: './first/second/index.js', importedAs: '' },
    { filename: './third/index.js', importedAs: '' },
    { filename: './first/fourth/index.js', importedAs: '' },
  ],
  cjs: [
    { filename: './index.js', importedAs: '' },
    { filename: './yo.js', importedAs: '' },
  ],
  resolve: [
    { filename: './index.js', importedAs: '' },
    { filename: './a.js', importedAs: '' },
    { filename: './x.js', importedAs: '' },
    { filename: './z/index.js', importedAs: '' },
    { filename: './b/index.js', importedAs: '' },
    { filename: './b/c.js', importedAs: '' },
    { filename: './b/d/index.js', importedAs: '' },
  ],
  cyclic: [
    { filename: './main.js', importedAs: '' },
    { filename: './a.js', importedAs: '' },
    { filename: './b.js', importedAs: '' },
  ],
  modules: [
    { filename: './index.js', importedAs: '' },
    { filename: null, error: Error, importedAs: 'meow', importedAs: '' },
    { filename: './pew.js', importedAs: '' },
  ],
  missing: [
    { filename: './index.js', importedAs: '' },
    { filename: './one.js', importedAs: '' },
    { filename: './two.js', importedAs: '' },
    { filename: null, error: Error, importedAs: './extra.js' },
  ],
};
/*
*/

const path = 'fixtures/graph';

test('basic', t =>
  esDepsDeepResolved(`./${path}/basic/`)
    .then(result => t.same(expected.basic, result)));

test.skip('basic plus', t =>
  esDepsDeepResolved(`./${path}/basic-plus/index.js`)
    .then(result => t.same(expected.basicPlus, result)));

test.skip('extended', t =>
  esDepsDeepResolved(`./${path}/extended/index.js`)
    .then(result => t.same(expected.extended, result)));

test.skip('cjs', t =>
  esDepsDeepResolved(`./${path}/cjs/index.js`)
    .then(result => t.same(expected.cjs, result)));

test.skip('resolve', t =>
  esDepsDeepResolved(`./${path}/resolve`)
    .then(result => t.same(expected.resolve, result)));

// https://nodejs.org/api/modules.html#modules_cycles
test.skip('cyclic', t =>
  esDepsDeepResolved(`./${path}/cyclic/main.js`)
    .then(result => t.same(expected.cyclic, result)));

test.skip('modules', t =>
  esDepsDeepResolved(`./${path}/modules/`)
    .then(result => t.same(expected.modules, result)));

test.skip('missing', t =>
  esDepsDeepResolved(`./${path}/missing/`)
    .then(result => t.same(expected.missing, result)));

test('should reject on empty input', t => t.throws(esDepsDeepResolved(), TypeError));
test('should reject on invalid input', t => t.throws(esDepsDeepResolved(2), TypeError));
