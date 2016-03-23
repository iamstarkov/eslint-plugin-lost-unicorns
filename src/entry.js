import importList from 'import-list-from-string';
import pify from 'pify';
import _fs from 'fs';
import R from 'ramda';
import { resolve } from './utils/promise-fp';

const fs = pify(_fs);

// entry :: String -> Promise Array[String]
const entry = R.pipeP(resolve,
  path => fs.readFile(path, 'utf8'),
  importList,
  R.reject(R.isNil) // that should be a bug in importList implementation
);

export default entry;
