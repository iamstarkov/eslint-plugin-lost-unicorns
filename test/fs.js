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

test('should reject on empty input', t =>
  t.throws(fs(), '`path` should be String, but got `undefined`'));

test('should reject on invalid input', t =>
  t.throws(fs(2), '`path` should be String, but got `number`'));
