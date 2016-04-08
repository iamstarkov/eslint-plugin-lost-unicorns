import R from 'ramda';
import esDepsResolved from 'es-deps-resolved';

function esDepsResolvedDeep(filename) {
  return Promise.resolve(filename);
}

export default esDepsResolvedDeep;
