import R from 'ramda';
import esDeps from 'es-deps';
import contract from './utils/contract';
import { all, resolve } from './utils/promise-methods';
import { normalize, relative as _relative, join as _join, dirname } from 'path';

const join = R.curryN(2, _join);
const relative = R.curryN(2, _relative);

// chainP :: (Function -> [Promise]) -> [Promise]
const chainP = R.curry((fn, iterableP) => {
  return R.pipeP(resolve,
    R.map(fn),
    all,
    R.unnest
  )(iterableP);
});

function walk(filename) {
  const basedir = dirname(filename);
  return R.pipeP(
    esDeps,
    chainP(join(basedir)),
    chainP(walk),
    R.prepend(filename)
  )(filename);
}

// graph :: String -> Promise Array[String]
function graph(filename) {
  return R.pipeP(resolve,
    contract('path', String),
    normalize,
    walk,
    chainP(relative(dirname(filename))),
    R.uniq
  )(filename);
}

export default graph;
