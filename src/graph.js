import R from 'ramda';
import entry from './entry';
// import contract from './utils/contract';
import { log } from './utils/console-fp';
import { all, resolve } from './utils/promise-fp';
import path, { join, basename, dirname } from 'path';

function walk(rootdir, filename, entries) {
  const basedir = dirname(filename);
  const relativeToRoot = path.relative(rootdir, basedir);
  return R.pipeP(
    resolve,
    R.of,
    R.map(entry),
    all,
    R.flatten,
    R.tap(items => { entries = R.concat(entries, items.map(i => join(relativeToRoot, i))); }),
    R.map(filename => join(basedir, filename)),
    R.unless(R.isEmpty, R.pipeP(
      resolve,
      R.map(item => walk(rootdir, item, entries, basedir)),
      all,
      R.flatten
    )),
    R.when(R.isEmpty, () => {
      return resolve(entries.map(path.normalize));
    })
  )(filename);
};

// graph :: String -> Promise Array[String]
const graph = root => {
  const dir = dirname(root);
  return walk(dir, root, R.of(basename(root)));
};

export default graph;
