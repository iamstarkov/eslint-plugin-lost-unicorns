import test from 'ava';
import graph from '../src/graph';
import R from 'ramda';
import slash from 'slash';

const mapSlash = R.map(slash);

const expected = {
  basic: [
    './index.js',
    './first/index.js',
    './first/second/index.js',
  ],
  basicPlus: [
    './index.js',
    './first/index.js',
    './first/second/index.js',
    './first/second/three/index.js',
  ],
  extended: [
    './index.js',
    './first/index.js',
    './first/second/index.js',
    './third/index.js',
    './first/fourth/index.js',
  ],
  cjs: [
    './index.js',
    './yo.js',
  ],
  resolve: [
    './index.js',
    './a.js',
    './x.js',
    './z/index.js',
    './b/index.js',
    './b/c.js',
    './b/d/index.js',
  ],
  cyclic: [
    './main.js',
    './a.js',
    './b.js',
  ],
  modules: [
    './index.js',
    'meow',
    './pew.js',
  ],
  missing: [
    './index.js',
    './one.js',
    './two.js',
  ],
  notOnlyJS: [
    'index.js',
    'app.js',
    'button/index.js',
    'button/button.jsx',
    'button/button.css',
    'button/css.png',
    'button/js.png',
  ],
};

const path = 'fixtures/graph';

test('basic', t =>
  graph(`./${path}/basic/index.js`)
    .then(result => t.deepEqual(expected.basic, mapSlash(result))));

test('basic plus', t =>
  graph(`./${path}/basic-plus/index.js`)
    .then(result => t.deepEqual(expected.basicPlus, mapSlash(result))));

test('extended', t =>
  graph(`./${path}/extended/index.js`)
    .then(result => t.deepEqual(expected.extended, mapSlash(result))));

test('cjs', t =>
  graph(`./${path}/cjs/index.js`)
    .then(result => t.deepEqual(expected.cjs, mapSlash(result))));

test('resolve', t =>
  graph(`./${path}/resolve`)
    .then(result => t.deepEqual(expected.resolve, mapSlash(result))));

// https://nodejs.org/api/modules.html#modules_cycles
test('cyclic', t =>
  graph(`./${path}/cyclic/main.js`)
    .then(result => t.deepEqual(expected.cyclic, mapSlash(result))));

test('modules', t =>
  graph(`./${path}/modules/`)
    .then(result => t.deepEqual(expected.modules, mapSlash(result))));

test('missing', t =>
  graph(`./${path}/missing/`)
    .then(result => t.deepEqual(expected.missing, mapSlash(result))));

test('not-only-js', t =>
  graph('./fixtures/graph/not-only-js/index.js')
    .then(result => t.same(expected.notOnlyJs, result)));

test('should reject on empty input', t => t.throws(graph(), TypeError));
test('should reject on invalid input', t => t.throws(graph(2), TypeError));
