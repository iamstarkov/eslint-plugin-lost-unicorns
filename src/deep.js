import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import path from 'path';
import resolveCwd from 'resolve-cwd';
import { contractP } from './utils/contract';
import d from './utils/debug';
import { isModule } from './is-module';

const { cwd } = process;
const { resolve, all, reject } = binded(Promise);
const { log } = binded(console);
const id = R.identity;

const join = R.curryN(2, path.join);

const reqResolveCwd = R.pipe(
  join(cwd()),
  require.resolve,
  id
);

const initDep = { requested: null, from: null };
const str2dep = R.pipe(
  R.objOf('resolved'),
  R.merge(initDep),
  id
);

const isRequestedDepModule = R.pipe(R.prop('requested'), isModule);
const isResolvedDepInNM = R.pipe(R.prop('requested'), isModule);

const meow = R.pipe(
  d('q'),
  // R.T,
  isResolvedDepInNM,
  // isRequestedDepModule,
  d('q a'),
  id
);

// esDepsResolvedDeep :: String -> Array[Object]
function esDepsResolvedDeep(file, nested=false) {
  let cache = [];

  const lol = !nested ? R.F : meow;

  const deps = R.pipeP(resolve,
    R.prop('resolved'),
    R.ifElse(R.isNil,
      R.always([]),
      esDepsResolved)
  );

  const walk = item => {
    if (R.contains(item.resolved, cache)) {
      return resolve([]);
    } else {
      cache.push(item.resolved);
      return R.pipeP(resolve,
        deps,
        mapWalk,
        R.prepend(item),
        R.unnest,
        R.reject(lol),
        id
      )(item);
    }
  }

  const mapWalk = items => all(items.map(walk));

  return R.pipeP(resolve,
    contractP('file', String),
    resolveCwd,
    R.when(R.isNil, () => reject(new Error(`Can't find and open \`${file}\``))),
    str2dep,
    R.of,
    mapWalk,
    R.unnest,
    d('RESULT'),
    id
  )(file);
}

export default esDepsResolvedDeep;
