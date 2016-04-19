import R from 'ramda';
import { isModule, isLocalFile } from './is-module';

const notNil = R.complement(R.isNil);
const _requested = R.prop('requested');
const _resolved = R.prop('resolved');
const _from = R.prop('from');

// requestedModule :: Object -> Boolean
const isEntry = R.pipe(R.of, R.ap([_requested, _from]), R.all(R.isNil));

// requestedModule :: Object -> Boolean
const requestedModule = R.pipe(_requested, R.ifElse(notNil, isModule, R.F));

// requestedLocalFile :: Object -> Boolean
const requestedLocalFile = R.pipe(_requested, R.ifElse(notNil, isLocalFile, R.F));

// inNodeModules :: Object -> Boolean
const inNodeModules = R.pipe(_resolved, R.ifElse(notNil, R.test(/node_modules/), R.F));

// requestedFromNodeModules :: Object -> Boolean
const requestedFromNodeModules = R.pipe(_from, R.ifElse(notNil, R.test(/node_modules/), R.F));

// resolved :: Object -> Boolean
const resolved = R.pipe(_resolved, notNil);

// notResolved :: Object -> Boolean
const notResolved = R.pipe(_resolved, R.isNil);

export default {
  isEntry,
  requestedModule,
  requestedLocalFile,
  inNodeModules,
  requestedFromNodeModules,
  resolved,
  notResolved,
};
