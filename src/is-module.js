import R from 'ramda';
import { contract } from './utils/contract';

const isLocalReg = /\.|\//;

const isLocalFile = R.unary(R.pipe(
  contract('path', String),
  R.take(1),
  R.test(isLocalReg)
));

const isModule = R.unary(R.pipe(
  contract('path', String),
  R.take(1),
  R.test(isLocalReg),
  R.not
));

export { isLocalFile, isModule };
