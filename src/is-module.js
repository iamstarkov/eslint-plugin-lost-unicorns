import R from 'ramda';

const isLocalFile = R.pipe(R.take(1), R.test(/\.|\//));
const isModule = R.pipe(isLocalFile, R.not);

export { isLocalFile, isModule };
