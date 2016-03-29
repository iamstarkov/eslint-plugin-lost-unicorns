import R from 'ramda';
import diff from 'lodash.difference';

// isArrayOfString :: Constructor -> Input -> Boolean
const isArrayOf = R.curry((ctor, input) => R.both(R.is(Array), R.all(R.is(ctor)))(input));

const lostUnicorn = (fs, graph) => R.pipe(
  () => R.unless(isArrayOf(String), () => {
    throw new TypeError(`\`fs\` should be an \`Array[String]\`, but got \`${R.type(fs)}\``);
  })(fs),
  () => R.unless(isArrayOf(String), () => {
    throw new TypeError(`\`graph\` should be an \`Array[String]\`, but got \`${R.type(fs)}\``);
  })(graph),
  () => diff(fs, graph)
)(fs);

export default lostUnicorn;
