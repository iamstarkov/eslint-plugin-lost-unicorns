import R from 'ramda';
import entry from './entry';
import contract from './utils/contract';
import { all, resolve } from './utils/promise-fp';

// @todo implement recursion properly
// @todo take a look into path.base and path.resolve

// graph :: String -> Promise Array[String]
const graph = R.pipeP(resolve,
  contract('path', String),
  entry,
  R.map(entry),
  all
);

export default graph;
