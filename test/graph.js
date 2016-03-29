import test from 'ava';
import graph from '../src/graph';

const expected = {
  basic: [
    'index.js',
    'first/index.js',
    'first/second/index.js',
  ],
  basicPlus: [
    'index.js',
    'first/index.js',
    'first/second/index.js',
    'first/second/three/index.js',
  ],
  extended: [
    'index.js',
    'first/index.js',
    'first/second/index.js',
    'third/index.js',
    'first/fourth/index.js',
  ],
  cjs: [
    'index.js',
    'yo.js',
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

test('should reject on empty input', t =>
  t.throws(graph(), '`path` should be `String`, but got `Undefined`'));

test('should reject on invalid input', t =>
  t.throws(graph(2), '`path` should be `String`, but got `Number`'));
