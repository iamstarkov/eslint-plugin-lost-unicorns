import test from 'ava';
import R from 'ramda';
import binded from '../src/binded';
import Promise from 'pinkie-promise';

test('an Object', t =>
  t.is(R.type(binded(console)), 'Object'));

test('still a function', t =>
  t.is(R.type(binded(console).log), 'Function'));

test('even Promise.reject is a function', t =>
  t.is(R.type(binded(Promise).reject), 'Function'));

test('Promise.resolve still works', t =>
  binded(Promise).resolve(true).then(i => t.true(i)));

test('empty input', t => t.throws(() => { binded(); }, TypeError));
