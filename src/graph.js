import R from 'ramda';
import esDeps from 'es-deps';
import contract from './utils/contract';
import { log } from './utils/console-methods';
import { all, resolve } from './utils/promise-methods';
import { normalize, relative as _relative, join as _join, dirname } from 'path';

const debug = msg => R.tap(R.partial(log, [msg]));
const { cwd } = process;

const join = R.curryN(2, _join);
const relative = R.curryN(2, _relative);

const sort = arr => arr.sort();

const resolveFile = R.pipe(
  join(cwd()),
  require.resolve,
  relative(cwd())
);

// chainP :: (Function -> [Promise]) -> [Promise]
const chainP = R.curry((fn, iterableP) => {
  return R.pipeP(resolve,
    // R.tap(R.pipe(
      // R.map(relative('fixtures/graph/cyclic')),
      // debug('chainP')
    // )),
    R.map(fn),
    all,
    R.unnest
  )(iterableP);
});

let counter = 0;

const walk = R.memoize(R.curry(function(visited, file) {
  counter++;
  const basedir = dirname(file);
  return R.unless(
    R.contains(R.__, visited),
    R.pipeP(resolve,
      // debug('walk'),
      esDeps,
      R.map(R.pipe(
        join(basedir),
        resolveFile
      )),
      chainP(R.memoize(walk(R.pipe(
        R.unless(
          R.contains(file),
          R.append(file)
        ),
        R.uniq,
        sort
      )(visited)))),
      R.prepend(file)
    )
  )(file);
}));

// graph :: String -> Promise Array[String]
function graph(file) {
  return R.pipeP(resolve,
    contract('file', String),
    // debug('GRAPH'),
    // normalize, // seems like redundant
    resolveFile,
    walk([]),
    R.useWith(
      chainP,
      [R.pipe(resolveFile, dirname, relative), R.identity]
    )(file),
    R.uniq,
    // R.tap(() => log('counter', counter)),
    R.identity
  )(file);
}

export default graph;
