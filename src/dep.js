import R from 'ramda';
import { join } from 'path';
import d from './utils/debug';

const { cwd } = process;
const id = R.identity;

const joinNullCwd = (inPathArr, file) =>
  R.ifElse(
    R.is(String),
    R.pipe(
      // d('debug'), move it around to see whats in the output at current state in the pipe
      R.append(R.__, inPathArr),
      data => {
        // example function how to operate in non point-free mode
        const newData = data.map(item => item);
        return newData;
      },
      R.prepend(cwd()),
      R.apply(join),
      id
    ),
    R.always(null))(file);

const dep = R.curry((inPathArr, requested, from, resolved) => ({
  requested,
  from: joinNullCwd(inPathArr, from),
  resolved: joinNullCwd(inPathArr, resolved) }));

export default dep;
