import globby from 'globby';
import { reject } from './utils/promise-fp';

// fs :: String -> Promise Array[String]
const fs = path => typeof path === 'string'
  ? globby('**/*.js', { cwd: path })
  : reject(`\`path\` should be String, but got \`${typeof path}\``);

export default fs;
