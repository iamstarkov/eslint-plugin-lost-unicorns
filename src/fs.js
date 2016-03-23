import globby from 'globby';
import R from 'ramda';
import { resolve } from './utils/promise-fp';
import contract from './utils/contract';

// fs :: String -> Promise Array[String]
const fs = R.pipeP(resolve,
  contract('path', String),
  path => globby('**/*.js', { cwd: path }));

export default fs;
