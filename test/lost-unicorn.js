import test from 'ava';
import lostUnicorn from '../src/lost-unicorn';
import slash from 'slash';

const expected = [
  './extra1.js',
  './extra2.js',
  './first/extra3.js',
].map(slash);

test('should list all unused files', t =>
  lostUnicorn('./fixtures/lost-unicorn')
    .then(result => t.deepEqual(result, expected)));

test('empty input', t => { t.throws(lostUnicorn(), TypeError); });
test('invalid input', t => { t.throws(lostUnicorn(2), TypeError); });
