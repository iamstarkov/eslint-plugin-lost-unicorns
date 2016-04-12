/* eslint-disable no-multi-spaces, max-len */
import test from 'ava';
import deep from '../src/deep';
import { join } from 'path';

const { cwd } = process;
const joinCwd = filename => join(cwd(), 'fixtures', 'deep', filename);

const expected = [
  { requested: null,                from: null,                        resolved: joinCwd('./index.js') },
  { requested: './first/index.js',  from: joinCwd('./index.js'),       resolved: joinCwd('./first/index.js') },
  { requested: './second/index.js', from: joinCwd('./first/index.js'), resolved: joinCwd('./first/second/index.js') },
];

const path = 'fixtures/deep';

test('basic', t => deep(`./${path}/`)
  .then(_ => {
    t.same(_[0], expected[0]);
    t.same(_[1], expected[1]);
    t.same(_[2], expected[2]);
  }));

test('empty input', t => t.throws(deep(), TypeError));
test('invalid input', t => t.throws(deep(2), TypeError));
