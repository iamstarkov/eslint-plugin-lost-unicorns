import R from 'ramda';
import { log } from './console-methods';

const debug = msg => R.tap(R.partial(log, [msg]));

export default debug;
