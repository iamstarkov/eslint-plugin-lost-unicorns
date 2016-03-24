import R from 'ramda';
import diff from 'lodash.difference';

const error = msg => { throw new Error(msg); };

// isArrayOfString :: Input -> Boolean
const isArrayOfStrings = R.both(R.is(Array), R.all(R.is(String)));

const lostUnicorn = (fs, graph) => R.pipe(
  () => R.unless(isArrayOfStrings, () => error('`fs` should be an `Array[String]`, but got `Undefined`'))(fs),
  () => R.unless(isArrayOfStrings, () => error('`graph` should be an `Array[String]`, but got `Undefined`'))(graph),
  () => diff(fs, graph)
)(fs);

export default lostUnicorn;
