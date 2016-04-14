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

const dep = R.pipeP(resolve, R.prop('resolved'), esDepsResolved);

const walk = item => dep(item)
  .then(mapWalk)
  .then(_ => {
    log('deps', _);
    return [item, _];
  });

const mapWalk = items => all(items.map(walk));

const initDep = { requested: null, from: null };
const str2dep = R.pipe(R.objOf('resolved'), R.merge(initDep));

// esDepsResolvedDeep :: String -> Array[Object]
function esDepsResolvedDeep(file) {
  return R.pipeP(resolve,
    contractP('file', String),
    resolveCwd,
    str2dep,
    R.of,
    mapWalk,
    R.flatten,
    d('RESULT'),
    id
  )(file);
}

export default esDepsResolvedDeep;
