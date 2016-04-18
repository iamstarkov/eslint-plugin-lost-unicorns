import test from 'ava';
import dep from '../src/dep';
import { join } from 'path';

const { cwd } = process;

test('null', t => t.deepEqual(
  dep([], null, null, null),
  { from: null, requested: null, resolved: null }
));

test('requested', t => t.deepEqual(
  dep([], 'q', null, null).requested, 'q'
));

test('from', t => t.deepEqual(
  dep([], null, './m.js', null).from,
  join(cwd(), './m.js')
));

test('resolved', t => t.deepEqual(
  dep([], null, null, './m.js').resolved,
  join(cwd(), './m.js')
));

test('complicated shit', t => t.deepEqual(
  dep([], null, null, './basic/first/second/index.js'),
  { requested: null,
    from: null,
    resolved: join(cwd(), './basic/first/second/index.js') }
));

test('in path', t => t.deepEqual(
  dep(['meow', 'purr'], null, null, './basic/first/second/index.js'),
  { requested: null,
    from: null,
    resolved: join(cwd(), 'meow', 'purr', './basic/first/second/index.js') }
));

test('in path curried', t => t.deepEqual(
  dep(['meow', 'purr'])(null, null, './basic/first/second/index.js'),
  { requested: null,
    from: null,
    resolved: join(cwd(), 'meow', 'purr', './basic/first/second/index.js') }
));
