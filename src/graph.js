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

const depType = R.ifElse(isRelative, R.always('locals'), R.always('modules'));

const unitOf = R.pipe(
  join(cwd()),
  require.resolve,
  R.objOf('path')
);

const unitDeps = unit => R.pipeP(
  esDeps,
  R.groupBy(depType),
  R.evolve({
    locals: R.map(
      R.pipe(
        join(relative(cwd(), dirname(unit.path))),
        R.concat('./'),
        unitOf
      )
    ),
  }),
  R.merge(unit)
)(unit.path);

// chainP :: (Function -> [Promise]) -> [Promise]
const chainP = R.curry((fn, iterableP) => {
  return R.pipeP(resolve,
    R.map(fn),
    all,
    R.unnest
  )(iterableP);
});

const walk = R.curry((visited, file) => R.pipeP(
  unitDeps
)(file));

// graph :: String -> Promise Array[String]
function graph(file) {
  return R.pipeP(
    resolve,
    unitOf,
    walk([]),
    R.tap(R.pipe(
      (obj) => JSON.stringify(obj, null, 2),
      console.log.bind(console, 'GRAPH:')
    ))
  )(file);
}

export default graph;
