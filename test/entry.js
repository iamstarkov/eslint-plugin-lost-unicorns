import test from 'ava';
import entry from '../src/entry';

const expected = [
  './nested/yo.js',
];

test('should list all expected files', t => entry('./fixtures/entry/index.js')
  .then(result => t.same(expected, result)));

test('should reject on empty input', t =>
  t.throws(entry(), '`path` should be String, but got `undefined`'));

test('should reject on invalid input', t =>
  t.throws(entry(2), '`path` should be String, but got `number`'));
