import R from 'ramda';
import esDeps from 'es-deps';
import { contractP } from './utils/contract';
import { log } from './utils/console-methods';
import { all, resolve } from './utils/promise-methods';
import { relative as _relative, join as _join, dirname } from 'path';
import { isModule, isLocalFile } from './is-module';

const d = msg => R.tap(R.partial(log, [msg]));
const { cwd } = process;

const join = R.curryN(2, _join);
const relative = R.curryN(2, _relative);

// resolveFile :: String -> String
const resolveFile = R.pipe(
  join(cwd()),
  require.resolve,
  relative(cwd()),
  R.concat('./'));


// resolveRoot :: String -> String
const resolveRoot = R.pipe(
  resolveFile,
  dirname,
  join(cwd()));

// relativeRoot :: root -> file -> String
const relativeRoot = R.curry((root, file) => relative(resolveRoot(root), file));

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
        R.when(isModule, R.identity),
        R.when(isLocalFile, R.pipe(
          resolveBase(file),
          walk(R.append(file, visited))
        ))
      )),
      all,
      R.prepend(file)
    )
  )(file);
});

// graph :: String -> Promise Array[String]
function graph(file) {
  return R.pipeP(resolve,
    contractP('file', String),
    resolveFile,
    walk([]),
    all,
    R.flatten,
    R.map(R.when(isLocalFile, R.pipe(
      relativeRoot(file),
      R.concat('./')
    ))),
    R.uniq
  )(file);
}

export default graph;
