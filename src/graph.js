import R from 'ramda';
import esDeps from 'es-deps';
import { contract, reject } from './utils/contract';
import { log } from './utils/console-methods';
import { all, resolve } from './utils/promise-methods';
import { relative as _relative, join as _join, dirname } from 'path';
import { isModule, isLocalFile } from './is-module';

const d = msg => R.tap(R.partial(log, [`${msg}`]));
const { cwd } = process;

const id = R.identity;

const join = R.curryN(2, _join);
const relative = R.curryN(2, _relative);

const resolveFile = R.pipe(
  join(cwd()),
  require.resolve,
  relative(cwd()),
  R.concat('./')
);

// chainP :: (Function -> [Promise]) -> [Promise]
const chainP = R.curry((fn, iterableP) => R.pipeP(resolve,
  R.map(fn),
  all,
  R.unnest
)(iterableP));

const walk = R.curry((visited, file) => {
  const basedir = dirname(file);
  const resolveBase = R.pipe(join(basedir), resolveFile);
  let visitedAndCurrent = R.append(file, visited);
  return R.unless(
    R.contains(R.__, visited),
    R.pipeP(resolve,
      esDeps,
      R.tap(deps => { log('\nfile', file, deps); }),
      R.tap(R.map(R.when(isModule, item => {
        visitedAndCurrent = R.append(item, visitedAndCurrent);
      }))),
      R.pipe(
        R.filter(isLocalFile),
        R.map(resolveBase),
        chainP(walk(visitedAndCurrent)),
        id
      ),
      R.prepend(file),
      id
    )
  )(file);
});

// graph :: String -> Promise Array[String]
function graph(file) {
  return R.pipeP(resolve,
    contract('file', String, reject),
    resolveFile,
    walk([]),
    R.useWith(
      chainP,
      [R.pipe(resolveFile, dirname, relative), R.identity]
    )(file),
    R.map(R.concat('./')),
    R.uniq
  )(file);
}

export default graph;
