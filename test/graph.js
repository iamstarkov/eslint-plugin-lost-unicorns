import test from 'ava';
import graph from '../src/graph';

const expected = [
  './index.js',
  './nested/yo.js',
];

test('should list all expected files', t => graph('./fixtures/fs/index.js')
  .then(result => t.same(expected, result)));
