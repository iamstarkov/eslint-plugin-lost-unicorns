import test from 'ava';
import resolveFile from '../src/resolve-file';

test('folder', t =>
  t.is(resolveFile('./fixtures/resolve-file/'),  './fixtures/resolve-file/index.js'));

test('without extension', t =>
  t.is(resolveFile('./fixtures/resolve-file/index'),  './fixtures/resolve-file/index.js'));

test('simple file', t =>
  t.is(resolveFile('./fixtures/resolve-file/index.js'),  './fixtures/resolve-file/index.js'));
