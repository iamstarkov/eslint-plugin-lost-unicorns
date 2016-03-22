import test from 'ava';
import fs from '../src/fs';

const expected = [
  './src/one.js',
  './src/two.js',
  './src/nested/yo.js',
];

test('fs', t => fs('./fixtures/fs')
  .then(result => t.same(expected, result)));
