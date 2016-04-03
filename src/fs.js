import globby from 'globby';
import R from 'ramda';
import { resolve } from './utils/promise-methods';
import { contractP } from './utils/contract';

// fs :: String -> Promise Array[String]
const fs = R.unary(R.pipeP(resolve,
  contractP('path', String),
  path => globby(['**/*.js', '!node_modules/**'], { cwd: path })));

export default fs;
