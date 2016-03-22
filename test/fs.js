import test from 'ava';
import fs from '../src/fs';

const expected = [
  'nested/yo.js',
  'one.js',
  'two.js',
];

test('fs', t => fs('./fixtures/fs')
  .then(result => t.same(expected, result)));
