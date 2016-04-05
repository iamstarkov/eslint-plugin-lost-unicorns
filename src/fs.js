import globby from 'globby';
import R from 'ramda';
import { contractP } from './utils/contract';
import Promise from 'pinkie-promise';
import binded from 'binded';

const { resolve } = binded(Promise);

// fs :: String -> Promise Array[String]
const fs = R.unary(R.pipeP(resolve,
  contractP('path', String),
  path => globby(['**/*.js', '!node_modules/**'], { cwd: path }),
  R.map(R.concat('./'))));

export default fs;
