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

  const dep = R.pipeP(resolve, R.prop('resolved'), esDepsResolved);

  const walk = item => {
    if (R.contains(item.resolved, cache)) {
      return resolve([]);
    } else {
      cache.push(item.resolved);
      return dep(item)
        .then(mapWalk)
        .then(_ => {
          console.log('\nCACHE', cache);
          return [item, _];
        });
    }
  }

  const mapWalk = items => all(items.map(walk));

  return R.pipeP(resolve,
    contractP('file', String),
    resolveCwd,
    d('m'),
    str2dep,
    R.of,
    mapWalk,
    R.flatten
  )(file);
}

export default esDepsResolvedDeep;
