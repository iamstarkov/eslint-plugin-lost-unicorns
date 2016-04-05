import R from 'ramda';
import binded from '../binded';

const { log } = binded(console);

const debug = msg => R.tap(R.partial(log, [msg]));

export default debug;
