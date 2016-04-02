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

// resolveFile :: String -> String
const resolveFile = R.pipe(
  join(cwd()),
  require.resolve,
  relative(cwd()),
  R.concat('./'));

// resolveRoot :: String -> String
const resolveRoot = R.memoize(R.pipe(
  resolveFile,
  dirname,
  join(cwd())));

// resolveBase -> String -> (Function -> String -> String)
const resolveBase = base => R.pipe(
  join(dirname(base)),
  resolveFile);

const walk = R.curry((visited, file) => {
  return R.unless(
    R.contains(R.__, visited),
    R.pipeP(resolve,
      esDeps,
      R.map(R.pipe(
        R.when(isModule, id),
        R.when(isLocalFile, R.pipe(
          resolveBase(file),
          walk(R.append(file, visited))
        ))
      )),
      R.prepend(file)
    )
  )(file);
});

// graph :: String -> Promise Array[String]
function graph(file) {
  return R.pipeP(resolve,
    contract('file', String, reject),
    resolveFile,
    walk([]),
    all,
    R.flatten,
    R.map(R.when(isLocalFile, R.pipe(
      relative(resolveRoot(file)),
      R.concat('./')
    ))),
    R.uniq
  )(file);
}

export default graph;
