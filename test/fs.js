import test from 'ava';
import fs from '../src/fs';

const expected = [
  'nested/yo.js',
  'one.js',
  'two.js',
];

test('should list all expected files', t => fs('./fixtures/fs')
  .then(result => t.same(expected, result)));

test('should not include css file', t => fs('./fixtures/fs')
  .then(result => result.find(item => item === 'three.css'))
  .then(result => t.notOk(result)));
