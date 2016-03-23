import test from 'ava';
import entry from '../src/entry';

const expected = [
  './nested/yo.js',
];

test('should list all expected files', t => entry('./fixtures/fs/index.js')
  .then(result => t.same(expected, result)));
