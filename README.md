# eslint-plugin-lost-unicorns

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> no one unicorn should be lost

## Specification

```js
// deps-list list item spec
/* [{
  type: 'module',
  name: 'meow',
  path: Either('./node_modules/meow', null)
}, {
  type: 'file',
  parent: './meow.js',
  path: Either('./purr.js', null)
}] */
const isFile = R.propEq('type', 'file');
const isModule = R.propEq('type', 'module');
const isMissed = R.propEq('path', null);
const name = R.prop('name');
const path = R.prop('path');

const rules = {
  'no-unused-files': `
    * get all files
    * get graph, filter(isFile), map(path)
    * diff all files with prev line result
  `,
  'no-missed-files': `
    * get graph, filter(isFile), filter(isMissed)
    * log map(pick(['file', 'parent']))
  `,
  'no-unused-modules': `
    * get all modules from pkg
    * concat(
      * get graph, filter(isModule), map(name)
      * get used modules from npm scripts
    * ), uniq
    * diff all modules with prev line result
  `,
  'no-missed-modules': `
    * get all modules from pkg
    * concat(
      * get graph, filter(isModule), map(name)
      * get used modules from npm scripts
    * ), uniq
    * do all modules contains every module from prev line result
  `};

```
#### sanity check

Will `deps-list` list item spec help to implement each rule?


## Install

    npm install --save eslint-plugin-lost-unicorns

## Usage

```js
import eslintPluginLostUnicorns from 'eslint-plugin-lost-unicorns';

eslintPluginLostUnicorns('unicorns'); // unicorns
```

## API

### eslintPluginLostUnicorns(input, [options])

#### input

*Required*  
Type: `String`

Lorem ipsum.

#### options

##### foo

Type: `Boolean`  
Default: `false`

Lorem ipsum.

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/eslint-plugin-lost-unicorns
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-lost-unicorns.svg?style=flat-square

[travis-url]: https://travis-ci.org/iamstarkov/eslint-plugin-lost-unicorns
[travis-image]: https://img.shields.io/travis/iamstarkov/eslint-plugin-lost-unicorns.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/iamstarkov/eslint-plugin-lost-unicorns
[coveralls-image]: https://img.shields.io/coveralls/iamstarkov/eslint-plugin-lost-unicorns.svg?style=flat-square

[depstat-url]: https://david-dm.org/iamstarkov/eslint-plugin-lost-unicorns
[depstat-image]: https://david-dm.org/iamstarkov/eslint-plugin-lost-unicorns.svg?style=flat-square
