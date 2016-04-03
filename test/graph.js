import test from 'ava';
import graph from '../src/graph';

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
};

test('basic', t =>
  graph('./fixtures/graph/basic/index.js')
    .then(result => t.same(expected.basic, result)));

test('basic plus', t =>
  graph('./fixtures/graph/basic-plus/index.js')
    .then(result => t.same(expected.basicPlus, result)));

test('extended', t =>
  graph('./fixtures/graph/extended/index.js')
    .then(result => t.same(expected.extended, result)));

test('cjs', t =>
  graph('./fixtures/graph/cjs/index.js')
    .then(result => t.same(expected.cjs, result)));

test('resolve', t =>
  graph('./fixtures/graph/resolve')
    .then(result => t.same(expected.resolve, result)));

// https://nodejs.org/api/modules.html#modules_cycles
test('cyclic', t =>
  graph('./fixtures/graph/cyclic/main.js')
    .then(result => t.same(expected.cyclic, result)));

test('modules', t =>
  graph('./fixtures/graph/modules/')
    .then(result => t.same(expected.modules, result)));

test('should reject on empty input', t => t.throws(graph(), TypeError));
test('should reject on invalid input', t => t.throws(graph(2), TypeError));
