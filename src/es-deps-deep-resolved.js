import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import { contractP } from './utils/contract';


const { resolve, all } = binded(Promise);
const id = R.identity;

import d from './utils/debug';

const children = R.pipeP(resolve,
  R.prop('resolved'),
  esDepsResolved,
  all,
  R.objOf('children'),
  id
);


const walk = R.pipeP(resolve,
  // R.of,
  // R.ap([id, children]),
  // all,
  // R.mergeAll,
  // R.evolve({ child: R.always('meow') }),
  // R.merge({  }),
  d('walk'),
  // R.evolve({ children: R.map(walk) }),
  // d('walk'),
  // walk,
  id
);

// esDepsResolvedDeep :: String -> Object
function esDepsResolvedDeep(file) {
  return R.pipeP(resolve,
    contractP('file', String),
    esDepsResolved,
    R.map(walk),
    // d('after'),
    id
  )(file);
}

export default esDepsResolvedDeep;
