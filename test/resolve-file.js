import test from 'ava';
import resolveFile from '../src/resolve-file';
import slash from 'slash';

const path = 'fixtures/resolve-file';

test('folder', t =>
  t.is(resolveFile(`./${path}/`), slash(`./${path}/index.js`)));

test('extension', t =>
  t.is(resolveFile(`./${path}/index`), slash(`./${path}/index.js`)));

test('file', t =>
  t.is(resolveFile(`./${path}/index.js`), slash(`./${path}/index.js`)));

test('404', t =>
  t.is(resolveFile(`./${path}/nope.js`), null));

test('empty input', t => t.throws(() => { resolveFile(); }, TypeError));
test('invalid input', t => t.throws(() => { resolveFile(2); }, TypeError));
