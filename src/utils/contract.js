import R from 'ramda';
import { reject } from './promise-methods';

const errorText = (name, ctor, param) => {
  const expected = R.type(ctor());
  const got = R.type(param);
  return `\`${name}\` should be \`${expected}\`, but got \`${got}\``;
};

// contract :: String -> Constructor -> a
const contract = R.curry((name, ctor, param) => R.unless(
  R.is(ctor),
  () => { throw new TypeError(errorText(name, ctor, param)); }
)(param));

const contractP = R.curry((name, ctor, param) => R.unless(
  R.is(ctor),
  () => reject(new TypeError(errorText(name, ctor, param)))
)(param));


export { contract, contractP };
