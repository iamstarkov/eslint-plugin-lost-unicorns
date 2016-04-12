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

// walk :: Array[Object] -> Object -> Array[Object]
const walk = (state, item) => {
  // log('walk', state, item);
  const newState = R.append(state, item);
  return R.pipeP(resolve,
    // d('pip')
    R.prop('resolved'),
    esDepsResolved,
    R.reduce(walk, R.__, newState),
    d('walk'),
    id
  )(item);
};

const initDep = { requested: null, from: null };
const str2dep = R.pipe(R.objOf('resolved'), R.merge(initDep));

// esDepsResolvedDeep :: String -> Array[Object]
function esDepsResolvedDeep(file) {
  return R.pipeP(resolve,
    contractP('file', String),
    resolveCwd,
    str2dep,
    R.of,
    R.reduce(walk, []),
    d('result'),
    id
  )(file);
}

export default esDepsResolvedDeep;
