import R from 'ramda';
import { join, isAbsolute } from 'path';
import d from './utils/debug';

const { cwd } = process;
const id = R.identity;

const joinNullCwd = (inPathArr, file) =>
  R.ifElse(
    R.is(String),
    R.ifElse(
      isAbsolute,
      item => item,
      R.pipe(
        R.append(R.__, inPathArr),
        R.prepend(cwd()),
        R.apply(join),
        d('debug'),
        id
      )
    ),
    R.always(null))(file);

const dep = R.curry((inPathArr, requested, from, resolved) => ({
  requested,
  from: joinNullCwd(inPathArr, from),
  resolved: joinNullCwd(inPathArr, resolved) }));

export default dep;
