import R from 'ramda';
import entry from './entry';
import contract from './utils/contract';
import { all, resolve } from './utils/promise-fp';
import { basename } from 'path';


// graph :: String -> Promise Array[String]
const graph = root => {
  const filesList = [ './' + basename(root)];
  return entry(root).then(imports => {
    const filesListWithImports = filesList.concat(imports);
    return filesListWithImports;
  });
};

export default graph;