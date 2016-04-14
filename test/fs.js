import test from 'ava';
import fs from '../src/fs';

const expected = [
  './index.js',
  './lost-unicorn.js',
  './nested/yo.js',
];

test('should list all js expected files, excepting node_modules', t =>
  fs('./fixtures/fs')
    .then(result => t.deepEqual(expected, result)));

test('should reject on empty input', t => t.throws(fs(), TypeError));
test('should reject on invalid input', t => t.throws(fs(2), TypeError));
