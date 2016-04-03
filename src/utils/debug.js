const debug = msg => R.tap(R.partial(log, [msg]));

export default debug;
