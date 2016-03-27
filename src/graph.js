import R from 'ramda';
import entry from './entry';
import contract from './utils/contract';
import { all, resolve } from './utils/promise-fp';
import { normalize, relative, join as _join, basename, dirname } from 'path';

const join = R.curryN(2, _join);

function walk(rootdir, filename, inputEntries) {
  let entries;
  const basedir = dirname(filename);
  const relativeToRoot = relative(rootdir, basedir);
  const mapToRoot = R.map(join(relativeToRoot));
  return R.pipeP(resolve,
    R.of,
    R.map(entry),
    all,
    R.flatten,
    R.tap(items => { entries = R.concat(inputEntries, mapToRoot(items)); }),
    R.map(join(basedir)),
    R.unless(R.isEmpty, R.pipeP(resolve,
      R.map(item => walk(rootdir, item, entries, basedir)),
      all,
      R.flatten
    )),
    R.when(R.isEmpty, () => entries.map(normalize))
  )(filename);
}

// graph :: String -> Promise Array[String]
const graph = R.pipeP(resolve,
  contract('path', String),
  root => walk(dirname(root), root, R.of(basename(root)))
);

export default graph;
