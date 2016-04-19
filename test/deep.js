/* eslint-disable no-multi-spaces, max-len */
import test from 'ava';
import deep from '../src/deep';
import { join } from 'path';
import R from 'ramda';
import kit from '../src/dep-kit';

const log = console.log.bind(console);
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

test('basic plus', t => deep(`./${path}/basic-plus/index.js`)
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

test('modules nested', t => deep(`./${path}/modules-nested`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './modules-nested/index.js'));
    t.deepEqual(_[1], f('./modules-nested/index.js', 'meow',  './modules-nested/node_modules/meow/index.js'));
    t.deepEqual(_[2], f('./modules-nested/node_modules/meow/index.js', 'purr',  './modules-nested/node_modules/meow/node_modules/purr/index.js'));
    t.deepEqual(_[3], f('./modules-nested/node_modules/meow/index.js', './pew', './modules-nested/node_modules/meow/pew/index.js'));
    t.deepEqual(_[4], f('./modules-nested/index.js', './pew', './modules-nested/pew.js'));
  }));

test('missing', t => deep(`./${path}/missing`)
  .then(_ => {
    t.deepEqual(_[0], f(null, null, './missing/index.js'));
    t.deepEqual(_[1], f('./missing/index.js', './one.js', './missing/one.js'));
    t.deepEqual(_[2], f('./missing/index.js', './two.js', './missing/two.js'));
    t.deepEqual(_[3], f('./missing/index.js', './extra.js', null));
  }));

// @TODO use more complicated case
test('not exclude at all, by default', t => deep(`./${path}/modules-nested`)
  .then(_ => { t.is(_.length, 5); }));

test('not exclude at all', t => deep(`./${path}/modules-nested`, R.F)
  .then(_ => { t.is(_.length, 5); }));

test('exclude everything', t => deep(`./${path}/modules-nested`, R.T)
  .then(_ => { t.is(_.length, 0); }));

// f(null, null, './modules-nested/index.js');
// f('./modules-nested/index.js', './pew', './modules-nested/pew.js');
// f('./modules-nested/index.js', 'meow',  './modules-nested/node_modules/meow/index.js');
// f('./modules-nested/node_modules/meow/index.js', 'purr',  './modules-nested/node_modules/meow/node_modules/purr/index.js');
// f('./modules-nested/node_modules/meow/index.js', './pew', './modules-nested/node_modules/meow/pew/index.js');

test('exclude entry', t => deep(`./${path}/modules-nested`, kit.isEntry)
  .then(_ => { t.is(_.length, 0); }));

test('exclude modules', t => deep(`./${path}/modules-nested`, kit.requestedModule)
  .then(_ => { t.is(_.length, 3); }));

test('exclude local files', t => deep(`./${path}/modules-nested`, kit.requestedLocalFile)
  .then(_ => { t.is(_.length, 3); }));

test('exclude node_modules', t => deep(`./${path}/modules-nested`, kit.inNodeModules)
  .then(_ => { t.is(_.length, 2); }));

test('exclude resolved', t => deep(`./${path}/modules-nested`, kit.resolved)
  .then(_ => { t.is(_.length, 0); }));

test('exclude not resolved', t => deep(`./${path}/modules-nested`, kit.notResolved)
  .then(_ => { t.is(_.length, 5); }));

// f(null, null, './modules-nested/index.js');
// f('./pew', './modules-nested/index.js', './modules-nested/pew.js');
// f('meow',  './modules-nested/index.js', './modules-nested/node_modules/meow/index.js');
// f('purr',  './modules-nested/node_modules/meow/index.js',  './modules-nested/node_modules/meow/node_modules/purr/index.js');
// f('./pew', './modules-nested/node_modules/meow/index.js',  './modules-nested/node_modules/meow/pew/index.js');
const rejectMoreThanOneLevel = item => {
  log(item);
  if (kit.inNodeModules(item)) {
    return kit.requestedLocalFile(item);
    // return true;
  } else {
    return false;
  }
};
/*
if (kit.inNodeModules) {
  return (kit.localFile) {
    return true;
  } else {
    return false;
  }
} else {
  return false;
}
*/

// ./index.js
// ./node_modules/meow/index.js
// ./node_modules/meow/node_modules/purr/index.js
// ./pew.js

test('exclude more than one level deep', t => deep(`./${path}/modules-nested`, rejectMoreThanOneLevel)
  .then(_ => {
    console.log(_.map(R.prop('resolved')));
    t.deepEqual(_[0], f(null, null, './modules-nested/index.js'));
    t.deepEqual(_[1], f('./modules-nested/index.js',                   'meow',  './modules-nested/node_modules/meow/index.js'));
      // t.deepEqual(_[2], f('./modules-nested/node_modules/meow/index.js', 'purr',  './modules-nested/node_modules/meow/node_modules/purr/index.js'));
      // t.deepEqual(_[3], f('./modules-nested/node_modules/meow/index.js', './pew', './modules-nested/node_modules/meow/pew/index.js'));
    t.deepEqual(_[2], f('./modules-nested/index.js',                   './pew', './modules-nested/pew.js'));
  }));

test('unresolved', t => t.throws(deep(`./${path}/unresolved`), Error));
test('empty input', t => t.throws(deep(), TypeError));
test('invalid input', t => t.throws(deep(2), TypeError));
