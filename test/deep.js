/* eslint-disable no-multi-spaces, max-len */
import test from 'ava';
import deep from '../src/deep';
import { join } from 'path';
import R from 'ramda';

const { cwd } = process;
const joinCwd = filename => join(cwd(), 'fixtures', 'deep', filename);

const joinNullCwd = R.ifElse(R.is(String), joinCwd, R.always(null));

const first = { from: null, requested: null,  resolved: joinCwd('./index.js') };
const second = { from: joinCwd('./index.js'),       requested: './first/index.js',  resolved: joinCwd('./first/index.js') };
const third = {  from: joinCwd('./first/index.js'), requested: './second/index.js', resolved: joinCwd('./first/second/index.js') };
const expected = [first, second, third];

// : joinNullCwd(requested)
const f = (from, requested, resolved) => ({
  requested,
  from: joinNullCwd(from),
  resolved: joinNullCwd(resolved) });

const path = 'fixtures/deep';

test.skip('autistic', t => deep(`./${path}/first/index.js`)
  .then(_ => {
    t.deepEqual(_[0], expected[0]);
    t.deepEqual(_[1], expected[1]);
    t.deepEqual(_[2], expected[2]);
  }));

test('autistic one', t => deep(`./${path}/first/second/index.js`)
  .then(_ => { t.deepEqual(_[0], f(null, null, './first/second/index.js')); }));

test('autistic two', t => deep(`./${path}/first/index.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './first/index.js'));
    t.deepEqual(_[1], f('./first/index.js', './second/index.js', './first/second/index.js'));
  }));

test('empty input', t => t.throws(deep(), TypeError));
test('invalid input', t => t.throws(deep(2), TypeError));
