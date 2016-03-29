import R from 'ramda';
import diff from 'lodash.difference';

const error = msg => { throw new TypeError(msg); };

// isArrayOfString :: Input -> Boolean
const isArrayOfStrings = R.both(R.is(Array), R.all(R.is(String)));

const lostUnicorn = (fs, graph) => R.pipe(
  () => R.unless(isArrayOfStrings, () => error('`fs` should be an `Array[String]`, but got `' + R.type(fs) + '`'))(fs),
  () => R.unless(isArrayOfStrings, () => error('`graph` should be an `Array[String]`, but got `' + R.type(graph) + '`'))(graph),
  () => diff(fs, graph)
)(fs);

export default lostUnicorn;
