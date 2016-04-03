import test from 'ava';
import resolveFile from '../src/resolveFile';

const expected = {
  directory: './fixtures/resolveFile/directory/index.js',
};

test('directory', t =>
  resolveFile('./fixtures/resolveFile/directory')
    .then(result => t.same(expected.directory, result)));
