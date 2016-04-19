import R from 'ramda';
import Promise from 'pinkie-promise';
import builtinModules from 'builtin-modules';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import resolveCwd from 'resolve-cwd';
import { contractP } from './utils/contract';

import d from './utils/debug';

const { resolve, all, reject } = binded(Promise);
const id = R.identity;

const initDep = { requested: null, from: null };
const str2dep = R.pipe(R.objOf('resolved'), R.merge(initDep));

const isBuiltin = R.contains(R.__, builtinModules);

// esDepsResolvedDeep :: String -> Array[Object]
function esDepsResolvedDeep(file, exclude = R.F) {
  let cache = [];

  const deps = R.pipeP(resolve,
    R.prop('resolved'),
    // Built-in modules blows resolver
    R.ifElse(R.either(R.isNil, isBuiltin), R.always([]), esDepsResolved));

  const walk = item => {
    if (R.contains(item.resolved, cache)) {
      return resolve([]);
    } else {
      cache.push(item.resolved);
      return R.pipeP(resolve,
        deps,
        // JSON messes up the things
        R.reject(R.pipe(R.prop('resolved'), R.test(/json$/))),
        mapWalk,
        R.unnest,
        // d('\n\na'),
        R.reject(exclude),
        // d('\n\nb'),
        R.prepend(item),
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
    // d('a'),
    R.reject(exclude),
    // d('b'),
    mapWalk,
    R.unnest,
    // d('RESULT'),
    id
  )(file);
}

export default esDepsResolvedDeep;
