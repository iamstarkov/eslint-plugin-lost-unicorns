import R from 'ramda';
import Promise from 'pinkie-promise';
import binded from 'binded';
import esDepsResolved from 'es-deps-resolved';
import { contractP } from './utils/contract';

const { resolve } = binded(Promise);
const { log: _log } = binded(console);
const id = R.identity;

const log = R.tap(_log);

function esDepsResolvedDeep(file) {
  return R.pipeP(resolve,
    contractP('file', String),
    log,
    id
  )(file);
}

export default esDepsResolvedDeep;
