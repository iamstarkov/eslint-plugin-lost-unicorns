import test from 'ava';
import graph from '../src/graph';

const expected = [
  './index.js',
  './first/index.js',
  './first/second/index.js',
];

test('should list all expected files', t => graph('./fixtures/graph/index.js')
  .then(result => t.same(expected, result)));

test('should reject on empty input', t =>
  t.throws(graph(), '`path` should be `String`, but got `Undefined`'));

test('should reject on invalid input', t =>
  t.throws(graph(2), '`path` should be `String`, but got `Number`'));
