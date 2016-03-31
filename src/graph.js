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

const walk = R.curry((visited, file) => {
  const basedir = dirname(file);
  const visitedAndCurrent = R.append(file, visited);
  return R.unless(
    R.contains(R.__, visited),
    R.pipeP(resolve,
      esDeps,
      R.map(R.pipe(
        join(basedir),
        resolveFile
      )),
      chainP(walk(visitedAndCurrent)),
      R.prepend(file)
    )
  )(file);
});

// graph :: String -> Promise Array[String]
function graph(file) {
  return R.pipeP(resolve,
    contract('file', String),
    normalize,
    resolveFile,
    walk([]),
    R.useWith(
      chainP,
      [R.pipe(resolveFile, dirname, relative), R.identity]
    )(file),
    R.uniq
  )(file);
}

export default graph;
