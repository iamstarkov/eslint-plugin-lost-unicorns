import R from 'ramda';
import path from 'path';

const { cwd } = process;

const join = R.curryN(2, path.join);
const relative = R.curryN(2, path.relative);

// resolveFile :: String -> String
const resolveFile = R.pipe(
  join(cwd()),
  require.resolve,
  relative(cwd()),
  R.concat('./'));

export default resolveFile;
