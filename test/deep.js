/* eslint-disable no-multi-spaces, max-len */
import test from 'ava';
import deep from '../src/deep';
import { join } from 'path';

const { cwd } = process;
const joinCwd = filename => join(cwd(), 'fixtures', 'deep', filename);

const first = { requested: null, from: null, resolved: joinCwd('./index.js') };
const second = { requested: './first/index.js', from: joinCwd('./index.js'), resolved: joinCwd('./first/index.js') };
const third = { requested: './second/index.js', from: joinCwd('./first/index.js'), resolved: joinCwd('./first/second/index.js') };
const expected = [first, second, third];

const f = (requested, from, resolved) => ({ requested, from, resolved: joinCwd(resolved) });

const path = 'fixtures/deep';

test('autistic', t => deep(`./${path}/first/index.js`)
  .then(_ => {
    t.deepEqual(_[0], expected[0]);
    t.deepEqual(_[1], expected[1]);
    t.deepEqual(_[2], expected[2]);
  }));

test.only('autistic', t => deep(`./${path}/first/second/index.js`)
  .then(_ => { t.deepEqual(_[0], f(null, null, './first/second/index.js')); }));

test('empty input', t => t.throws(deep(), TypeError));
test('invalid input', t => t.throws(deep(2), TypeError));
