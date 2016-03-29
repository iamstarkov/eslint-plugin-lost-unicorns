import importList from 'import-list-from-string';
import pify from 'pify';
import _fs from 'fs';
import R from 'ramda';
import contract from './utils/contract';
import { resolve } from './utils/pure-promise';

const fs = pify(_fs);

// entry :: String -> Promise Array[String]
const entry = R.pipeP(resolve,
  contract('path', String),
  path => fs.readFile(path, 'utf8'),
  importList,
  R.of,
  R.unnest
);

export default entry;
