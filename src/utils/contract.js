import R from 'ramda';
import { reject } from './promise-fp';

// contract :: String -> Constructor -> a
const contract = R.curry((name, ctor, param) => R.unless(
  R.is(ctor),
  () => reject(`\`${name}\` should be \`${R.type(ctor())}\`, but got \`${R.type(param)}\``)
)(param));

export default contract;
