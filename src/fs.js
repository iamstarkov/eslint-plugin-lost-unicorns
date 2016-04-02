import globby from 'globby';
import R from 'ramda';
import { resolve } from './utils/promise-methods';
import { contract, reject } from './utils/contract';

// fs :: String -> Promise Array[String]
const fs = R.unary(R.pipeP(resolve,
  contract('path', String, reject),
  path => globby('**/*.js', { cwd: path })));

export default fs;
