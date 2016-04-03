import test from 'ava';
import resolveFile from '../src/resolve-file';

const path = 'fixtures/resolve-file';

test('folder', t =>
  t.is(resolveFile(`./${path}/`), `./${path}/index.js`));

test('extension', t =>
  t.is(resolveFile(`./${path}/index`), `./${path}/index.js`));

test('file', t =>
  t.is(resolveFile(`./${path}/index.js`), `./${path}/index.js`));

test('404', t =>
  t.is(resolveFile(`./${path}/nope.js`), null));

test('empty input', t =>
  t.throws(() => { resolveFile(); }, TypeError));

test('invalid input', t =>
  t.throws(() => { resolveFile(2); }, TypeError));
