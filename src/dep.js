import R from 'ramda';
import { join, isAbsolute } from 'path';

const { cwd } = process;

const joinNullCwd = (inPathArr, file) =>
  R.ifElse(
    R.is(String),
    R.unless(
      isAbsolute,
      R.pipe(
        R.append(R.__, inPathArr),
        R.prepend(cwd()),
        R.apply(join)
      )
    ),
    R.always(null))(file);

const dep = R.curry((inPathArr, requested, from, resolved) => ({
  requested,
  from: joinNullCwd(inPathArr, from),
  resolved: joinNullCwd(inPathArr, resolved) }));

export default dep;
