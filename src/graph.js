import R from 'ramda';
import entry from './entry';
import contract from './utils/contract';
import { all, resolve } from './utils/promise-fp';
import { normalize, join, basename, dirname, relative } from 'path';


// graph :: String -> Promise Array[String]
const graph = root => {
  const dir = dirname(root);
  const rootList = [ basename(root)];

  return entry(root)
    .then(R.map(normalize))
    .then(firstLvlImports => {
      const firstLvlList = rootList.concat(firstLvlImports);
      // console.log(
      //   firstLvlImports,
      //   firstLvlImports.map(i => join(dir, i))
      // );
      const importLvl1Promises = firstLvlImports.map(i => join(dir, i)).map(entry);
      return all(importLvl1Promises)
        .then(R.flatten)
        .then(R.map(normalize))
        .then(R.map(i => join('./first/' + i)))
        .then(secondLvlImports => {
          const secondLvlList = firstLvlList.concat(secondLvlImports);
          return secondLvlList;
      });
    });
};

export default graph;
