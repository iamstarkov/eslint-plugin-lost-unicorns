import R from 'ramda';
import { join } from 'path';
import pathIsAbsolute from 'path-is-absolute';

const { cwd } = process;

const joinNullCwd = (inPathArr, file) =>
  R.ifElse(
    R.is(String),
    R.unless(pathIsAbsolute, R.pipe(
      R.append(R.__, inPathArr),
      R.prepend(cwd()),
      R.apply(join)
    )),
    R.always(null))(file);

const dep = R.curry((inPathArr, requested, from, resolved) => ({
  requested,
  from: joinNullCwd(inPathArr, from),
  resolved: joinNullCwd(inPathArr, resolved) }));

export default dep;
