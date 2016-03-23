import test from 'ava';
import graph from '../src/graph';

const expected = [
  './index.js',
  './first/index.js',
  './first/second/index.js',
];

test('should list all expected files', t => graph('./fixtures/graph/index.js')
  .then(result => t.same(expected, result)));
