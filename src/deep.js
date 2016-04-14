import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import resolveCwd from 'resolve-cwd';
import { contractP } from './utils/contract';
import d from './utils/debug';

const { resolve, all } = binded(Promise);
const { log } = binded(console);
const id = R.identity;


const initDep = { requested: null, from: null };
const str2dep = R.pipe(R.objOf('resolved'), R.merge(initDep));

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
      return deps(item)
        .then(mapWalk)
        .then(_ => [item, _]);
    }
  }

  const mapWalk = items => all(items.map(walk));

  return R.pipeP(resolve,
    contractP('file', String),
    resolveCwd,
    str2dep,
    R.of,
    mapWalk,
    R.flatten
  )(file);
}

export default esDepsResolvedDeep;
