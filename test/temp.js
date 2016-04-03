import test from 'ava';
import graph from '../src/graph';

test('basic', t =>
  graph('./fixtures/graph/basic/index.js')
    .then(() => t.pass()));

test('basic plus', t =>
  graph('./fixtures/graph/basic-plus/index.js')
    .then(() => t.pass()));

test('extended', t =>
  graph('./fixtures/graph/extended/index.js')
    .then(() => t.pass()));

test('cjs', t =>
  graph('./fixtures/graph/cjs/index.js')
    .then(() => t.pass()));

test('resolve', t =>
  graph('./fixtures/graph/resolve')
    .then(() => t.pass()));

// https://nodejs.org/api/modules.html#modules_cycles
test('cyclic', t =>
  graph('./fixtures/graph/cyclic/main.js')
    .then(() => t.pass()));
