import R from 'ramda';
import { contract } from './utils/contract';

const isLocalReg = /^[./]/;

const isLocalFile = R.unary(R.pipe(
  contract('path', String),
  R.test(isLocalReg)
));

const isModule = R.pipe(
  isLocalFile,
  R.not
);

export { isLocalFile, isModule };
