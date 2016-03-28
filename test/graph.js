import test from 'ava';
import graph from '../src/graph';

const expected = {
  basic: [
    'index.js',
    'first/index.js',
    'first/second/index.js',
    'third/index.js',
    'first/fourth/index.js',
  ],
  plus: [
    'index.js',
    'first/index.js',
    'first/second/index.js',
    'first/second/three/index.js',
  ],
};

test('basic: should list all expected files', t =>
  graph('./fixtures/graph/basic/index.js')
    .then(result => t.same(expected.basic, result)));

test('basic plus: should list all expected files', t =>
  graph('./fixtures/graph/basic-plus/index.js')
    .then(result => t.same(expected.plus, result)));

test('should reject on empty input', t =>
  t.throws(graph(), '`path` should be `String`, but got `Undefined`'));

test('should reject on invalid input', t =>
  t.throws(graph(2), '`path` should be `String`, but got `Number`'));
