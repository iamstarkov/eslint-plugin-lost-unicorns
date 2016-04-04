import R from 'ramda';

const bind = input => (state, name) =>
  R.merge(state, { [name]: input[name].bind(input) });

function binded(input) {
  if (!input) {
    throw new TypeError('`input` should not be empty');
  }
  return R.pipe(
    Object.getOwnPropertyNames,
    R.filter(R.pipe(
      R.prop(R.__, input),
      R.is(Function)
    )),
    R.reduce(bind(input), {})
  )(input);
}

export default binded;
