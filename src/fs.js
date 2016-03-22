import globby from 'globby';

// fs :: String -> Promise Array[String]
const fs = path => typeof path === 'string'
  ? globby('**/*.js', { cwd: path })
  : Promise.reject(`\`path\` should be String, but got \`${typeof path}\``);

export default fs;
