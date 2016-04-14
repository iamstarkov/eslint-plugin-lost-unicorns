/* eslint-disable no-multi-spaces, max-len */
import test from 'ava';
import deep from '../src/deep';
import { join } from 'path';
import R from 'ramda';

const { cwd } = process;
const joinCwd = filename => join(cwd(), 'fixtures', 'deep', filename);

const joinNullCwd = R.ifElse(R.is(String), joinCwd, R.always(null));

const f = (from, requested, resolved) => ({
  requested,
  from: joinNullCwd(from),
  resolved: joinNullCwd(resolved) });

const path = 'fixtures/deep';

test('autistic one', t => deep(`./${path}/first/second/index.js`)
  .then(_ => { t.deepEqual(_[0], f(null, null, './first/second/index.js')); }));

test('autistic two', t => deep(`./${path}/first/index.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './first/index.js'));
    t.deepEqual(_[1], f('./first/index.js', './second/index.js', './first/second/index.js'));
  }));

test('autistic three', t => deep(`./${path}/index.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './index.js'));
    t.deepEqual(_[1], f('./index.js', './first/index.js', './first/index.js'));
    t.deepEqual(_[2], f('./first/index.js', './second/index.js', './first/second/index.js'));
  }));

test('empty input', t => t.throws(deep(), TypeError));
test('invalid input', t => t.throws(deep(2), TypeError));
