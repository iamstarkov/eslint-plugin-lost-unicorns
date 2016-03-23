import R from 'ramda';
import entry from './entry';
import { all, resolve } from './utils/promise-fp';

// graph :: String -> Promise Array[String]
const graph = R.pipeP(resolve,
  entry,
  R.map(entry),
  all
);

export default graph;
