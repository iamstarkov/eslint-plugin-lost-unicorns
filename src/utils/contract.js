import R from 'ramda';
import { reject } from './promise-methods';

// contract :: String -> Constructor -> cb -> a
const contract = R.curry((name, ctor, cb, param) => R.unless(
  R.is(ctor),
  () => cb(
    new TypeError(`\`${name}\` should be \`${R.type(ctor())}\`, but got \`${R.type(param)}\``)
  )
)(param));

const thr = error => { throw error; };

export { contract, thr, reject };
