import test from 'ava';
import lostUnicorn from '../src/lost-unicorn';

const graph = [
  './index.js',
  './two/index.js',
];

const fs = [
  './index.js',
  './two/index.js',
  './lost/unicorn.js',
];

const expected = [
  './lost/unicorn.js',
];

test('should list all expected files', t => {
  t.same(lostUnicorn(fs, graph), expected);
});

test('should throw on empty input', t => {
  t.throws(() => { lostUnicorn(); }, TypeError);
  t.throws(() => { lostUnicorn(['s']); }, TypeError);
});

test('should throw on invalid input', t => {
  t.throws(() => { lostUnicorn(2); }, TypeError);
  t.throws(() => { lostUnicorn(['yo'], 2); }, TypeError);
});
