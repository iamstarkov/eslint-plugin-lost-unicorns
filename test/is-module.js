import test from 'ava';
import { isLocalFile, isModule } from '../src/is-module';

test('./me',
  t => t.true(isLocalFile('./me')));

test('../me',
  t => t.true(isLocalFile('../me')));

test('/me',
  t => t.true(isLocalFile('/me')));

test('pkg',
  t => t.true(isModule('pkg')));
