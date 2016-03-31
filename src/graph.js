import R from 'ramda';
import esDeps from 'es-deps';
import contract from './utils/contract';
import { log } from './utils/console-methods';
import { all, resolve } from './utils/promise-methods';
import { normalize, relative as _relative, join as _join, dirname } from 'path';

const debug = msg => R.tap(R.partial(log, [`\n${msg}\n`]));
const { cwd } = process;

const join = R.curryN(2, _join);
const relative = R.curryN(2, _relative);

const resolveFile = R.pipe(
  join(cwd()),
  require.resolve,
  relative(cwd())
);

// chainP :: (Function -> [Promise]) -> [Promise]
const chainP = R.curry((fn, iterableP) => {
  return R.pipeP(resolve,
    R.map(fn),
    all,
    R.unnest
  )(iterableP);
});

function walk(file) {
  const basedir = dirname(file);
  return R.pipeP(resolve,
    esDeps,
    R.map(R.pipe(
      join(basedir),
      resolveFile
    )),
    chainP(walk),
    R.prepend(file)
  )(file);
}

// graph :: String -> Promise Array[String]
function graph(file) {
  return R.pipeP(resolve,
    contract('file', String),
    normalize,
    resolveFile,
    walk,
    chainP(R.pipe(
      R.when(R.is(String), resolveFile),
      dirname,
      relative
    )(file)),
    R.uniq
  )(file);
}

export default graph;
