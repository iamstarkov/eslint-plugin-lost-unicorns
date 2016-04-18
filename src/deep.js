import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import resolveCwd from 'resolve-cwd';
import { contractP } from './utils/contract';
import dep from './dep';

import d from './utils/debug';

const { resolve, all, reject } = binded(Promise);
const id = R.identity;

const initDep = { requested: null, from: null };
const str2dep = R.pipe(R.objOf('resolved'), R.merge(initDep));

// esDepsResolvedDeep :: String -> Array[Object]
function esDepsResolvedDeep(file, exclude=R.F) {
  let cache = [];

  const deps = R.pipeP(resolve,
    R.prop('resolved'),
    R.ifElse(R.isNil, R.always([]), esDepsResolved));

  const walk = item => {
    if (R.contains(item.resolved, cache)) {
      return resolve([]);
    } else {
      cache.push(item.resolved);
      return R.pipeP(resolve,
        deps,
        mapWalk,
        R.reject(exclude),
        R.prepend(item),
        R.unnest,
        id
      )(item);
    }
  };

  const mapWalk = items => all(items.map(walk));

  return R.pipeP(resolve,
    contractP('file', String),
    resolveCwd,
    R.when(R.isNil, () => reject(new Error(`Can't find and open \`${file}\``))),
    str2dep,
    R.of,
    R.reject(exclude),
    mapWalk,
    R.unnest,
    // d('RESULT'),
    id
  )(file);
}

export default esDepsResolvedDeep;
