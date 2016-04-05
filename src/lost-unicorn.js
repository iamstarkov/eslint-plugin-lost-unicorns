import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from './binded';
import { contractP } from './utils/contract';
import fs from './fs';
import graph from './graph';
import diff from 'lodash.difference';

const { resolve, all } = binded(Promise);

const lostUnicorn = R.unary(R.pipeP(resolve,
  contractP('file', String),
  R.of,
  R.ap([fs, graph]),
  all,
  R.apply(diff)));

export default lostUnicorn;
