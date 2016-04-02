import test from 'ava';
import { isLocalFile, isModule } from '../src/is-module';

test('./me', t =>
  t.true(isLocalFile('./me')));

test('../me', t =>
  t.true(isLocalFile('../me')));

test('/me', t =>
  t.true(isLocalFile('/me')));

test('pkg', t =>
  t.true(isModule('pkg')));

test('isLocalFile throws on empty input', t =>
  t.throws(() => { isLocalFile(); }, TypeError));

test('isLocalFile throws on invalid input', t =>
  t.throws(() => { isLocalFile(2); }, TypeError));

test('isModule throws on empty input', t =>
  t.throws(() => { isModule(); }, TypeError));

test('isModule throws on invalid input', t =>
  t.throws(() => { isModule(2); }, TypeError));
