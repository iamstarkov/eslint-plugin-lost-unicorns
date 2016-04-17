import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import path from 'path';
import resolveCwd from 'resolve-cwd';
import { contractP } from './utils/contract';
import d from './utils/debug';

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

// esDepsResolvedDeep :: String -> Array[Object]
function esDepsResolvedDeep(file) {
  let cache = [];

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
        R.prepend(item)
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
    R.flatten
  )(file);
}

export default esDepsResolvedDeep;
