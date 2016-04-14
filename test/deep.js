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

const path = join('fixtures', 'deep');

test('basic one', t => deep(`./${path}/basic/first/second/index.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './basic/first/second/index.js'));
  }));

test('basic two', t => deep(`./${path}/basic/first/index.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './basic/first/index.js'));
    t.deepEqual(_[1], f('./basic/first/index.js', './second/index.js', './basic/first/second/index.js'));
  }));

test('basic three', t => deep(`./${path}/basic/index.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './basic/index.js'));
    t.deepEqual(_[1], f('./basic/index.js', './first/index.js', './basic/first/index.js'));
    t.deepEqual(_[2], f('./basic/first/index.js', './second/index.js', './basic/first/second/index.js'));
  }));

test('empty input', t => t.throws(deep(), TypeError));
test('invalid input', t => t.throws(deep(2), TypeError));
