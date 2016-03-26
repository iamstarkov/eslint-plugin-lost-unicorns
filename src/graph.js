import R from 'ramda';
import entry from './entry';
import contract from './utils/contract';
import { all, resolve } from './utils/promise-fp';
import { normalize, join, basename, dirname, relative } from 'path';

function walk(filename, entries) {
  const basedir = dirname(filename);
  return R.pipeP(
    resolve,
    R.of,
    R.map(entry),
    all,
    R.flatten,
    R.tap(items => { entries = R.concat(entries, items); }),
    R.map((filename) => join(basedir, filename)),
    R.unless(R.isEmpty, R.pipeP(
      resolve,
      R.map(item => walk(item, entries)),
      all,
      R.flatten
    )),
    R.when(R.isEmpty, () => {
      entries = R.concat(R.of('./' + basename(filename)), entries);
      return resolve(entries);
    })
  )(filename);
};

// graph :: String -> Promise Array[String]
const graph = root => {
  const dir = dirname(root);
  const rootList = [root];

  return walk(root, []).then(R.tap(console.log.bind(console, 'RESULT:')));
};

export default graph;
