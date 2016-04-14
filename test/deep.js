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

test('basic three', t => deep(`./${path}/basic-plus/index.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './basic-plus/index.js'));
    t.deepEqual(_[1], f('./basic-plus/index.js',              './first/index.js',  './basic-plus/first/index.js'));
    t.deepEqual(_[2], f('./basic-plus/first/index.js',        './second/index.js', './basic-plus/first/second/index.js'));
    t.deepEqual(_[3], f('./basic-plus/first/second/index.js', './three/index.js',  './basic-plus/first/second/three/index.js'));
  }));

test('extended', t => deep(`./${path}/extended/index.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './extended/index.js'));
    t.deepEqual(_[1], f('./extended/index.js', './first/index.js', './extended/first/index.js'));
    t.deepEqual(_[2], f('./extended/first/index.js', './second/index.js', './extended/first/second/index.js'));
    t.deepEqual(_[3], f('./extended/first/index.js', '../third/index.js', './extended/third/index.js'));
    t.deepEqual(_[4], f('./extended/third/index.js', '../first/fourth/index.js', './extended/first/fourth/index.js'));
  }));

// do not need to test cjs, 'cause its the same way as es6 and es-deps handle them the same way

test('resolve', t => deep(`./${path}/resolve`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './resolve/index.js'));
    t.deepEqual(_[1], f('./resolve/index.js', './a', './resolve/a.js'));
    t.deepEqual(_[2], f('./resolve/index.js', './b', './resolve/b/index.js'));
  }));

// https://nodejs.org/api/modules.html#modules_cycles
test('cyclic', t => deep(`./${path}/cyclic/main.js`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './cyclic/main.js'));
    t.deepEqual(_[1], f('./cyclic/main.js', './a.js', './cyclic/a.js'));
    t.deepEqual(_[2], f('./cyclic/main.js', './b.js', './cyclic/b.js'));
  }));

test('modules', t => deep(`./${path}/modules`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './modules/index.js'));
    t.deepEqual(_[1], f('./modules/index.js', 'meow', null));
    t.deepEqual(_[2], f('./modules/index.js', './pew', './modules/pew.js'));
  }));

test('missing', t => deep(`./${path}/missing`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './missing/index.js'));
    t.deepEqual(_[1], f('./missing/index.js', './one.js', './missing/one.js'));
    t.deepEqual(_[2], f('./missing/index.js', './two.js', './missing/two.js'));
    t.deepEqual(_[3], f('./missing/index.js', './extra.js', null));
  }));

test('empty input', t => t.throws(deep(), TypeError));
test('invalid input', t => t.throws(deep(2), TypeError));
