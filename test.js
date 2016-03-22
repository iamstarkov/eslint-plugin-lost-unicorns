import test from 'ava';
import eslintPluginLostUnicorns from './index';

test('should eslintPluginLostUnicorns', (t) =>
  t.same(eslintPluginLostUnicorns('unicorns'), 'unicorns'));

test('should eslintPluginLostUnicorns invalid input', (t) =>
  t.same(eslintPluginLostUnicorns(), undefined));
