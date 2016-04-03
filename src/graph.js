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

const isRelative = R.test(/^[./]/);

const depType = path => isRelative(path) ? 'locals' : 'modules';

const unitDeps = unit => R.pipeP(
  esDeps,
  R.groupBy(depType),
  R.merge(unit)
)(unit.path);

const unitFromName = R.objOf('name');

const unitPath = R.curry((base, unit) => R.pipe(
  R.prop('name'),
  R.when(isRelative, join(cwd())),
  require.resolve,
  R.assoc('path', R.__, unit)
)(unit));

// chainP :: (Function -> [Promise]) -> [Promise]
const chainP = R.curry((fn, iterableP) => {
  return R.pipeP(resolve,
    R.map(fn),
    all,
    R.unnest
  )(iterableP);
});

const walk = R.curry((queue, visited, file) => {
  const unit = R.pipeP(
    resolve,
    unitFromName,
    unitPath(dirname(file)),
    unitDeps
  )(file);
});

// graph :: String -> Promise Array[String]
function graph(file) {
  return R.pipeP(
    resolve,
    walk([], []),
    R.tap(console.log.bind(console, 'GRAPH:'))
  )(file);
}

export default graph;
