import R from 'ramda';
import { access as _access } from 'fs';
import { all, resolve } from './utils/promise-methods';
import pify from 'pify';

const access = pify(_access);

// isRelative :: String -> Boolean
function isRelative(file) {
  return /^\./.test(file);
}

function tryIndex(file) {
  const resolved = `${file}/index.js`;
  return access(resolved).then(() => resolved).catch(() => null);
}

function tryJs(file) {
  const resolved = `${file}.js`;
  return access(resolved).then(() => resolved).catch(() => null);
}

function resolveFile(file) {
  return R.pipeP(
    resolve,
    R.juxt([tryIndex, tryJs]),
    all,
    R.find(R.pipe(R.isNil, R.not))
  )(file);
}

export default resolveFile;
