import R from 'ramda';
import { isModule, isLocalFile } from './is-module';

import d from './utils/debug';

const notNil = R.complement(R.isNil);
const _requested = R.prop('requested');
const _resolved = R.prop('resolved');

// requestedModule :: Object -> Boolean
const isEntry = R.allPass([R.propEq('requested', null), R.propEq('from', null)]);

// requestedModule :: Object -> Boolean
const requestedModule = R.pipe(_requested, R.ifElse(notNil, isModule, R.F));

// requestedLocalFile :: Object -> Boolean
const requestedLocalFile = R.pipe(_requested, R.ifElse(notNil, isLocalFile, R.F));

// inNodeModules :: Object -> Boolean
const inNodeModules = R.pipe(_resolved, R.ifElse(notNil, R.test(/node_modules/), R.F));

// resolved :: Object -> Boolean
const resolved = R.pipe(_resolved, notNil);

// notResolved :: Object -> Boolean
const notResolved = R.pipe(_resolved, R.isNil);

export default {
  isEntry,
  requestedModule,
  requestedLocalFile,
  inNodeModules,
  resolved,
  notResolved,
};
