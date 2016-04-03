import R from 'ramda';
import { resolve, all } from './utils/promise-methods';
import { contractP } from './utils/contract';
import fs from './fs';
import graph from './graph';
import diff from 'lodash.difference';

const lostUnicorn = R.unary(R.pipeP(resolve,
  contractP('file', String),
  R.of,
  R.ap([fs, graph]),
  all,
  R.apply(diff)));

export default lostUnicorn;
