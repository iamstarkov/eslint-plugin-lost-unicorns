import R from 'ramda';
import { isModule, isLocalFile } from './is-module';

import d from './utils/debug';

const notNil = R.complement(R.isNil);
const requested = R.prop('requested');
const resolved = R.prop('resolved');

// requestedModule :: Object -> Boolean
export const isEntry = R.allPass([R.propEq('requested', null), R.propEq('from', null)]);

// requestedModule :: Object -> Boolean
export const requestedModule = R.pipe(requested, R.ifElse(notNil, isModule, R.F));

// requestedLocalFile :: Object -> Boolean
export const requestedLocalFile = R.pipe(requested, R.ifElse(notNil, isLocalFile, R.F));

// inNodeModules :: Object -> Boolean
export const inNodeModules = R.pipe(resolved, R.ifElse(notNil, R.test(/node_modules/), R.F));
