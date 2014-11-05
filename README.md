Get require() like node-requires by lexical analysis
===

[![NPM version](https://badge.fury.io/js/crequire.png)](https://npmjs.org/package/crequire)
[![Build Status](https://secure.travis-ci.org/seajs/crequire.png?branch=master)](https://travis-ci.org/seajs/crequire)

changed name from "searequire"


### Installation
```
npm install crequire
```

### Api
* parseDependencies(code:String, callback:Function = null, flag:Boolean = false):String
* parseDependencies(code:String, flag:Boolean = false):String
  * flag means if use "require.async" like, the result should have a property "flag" of ".async"

### Example
js:
```js
require('a');
//require('b');
/require('c')/;
'require("d")';
if(true)/require('e')/;
do /require('f')/.test(s); while(false);
```
parser output:
```js
{
  "string": "require('a')",
  "path": "a",
  "index": 0,
  "flag": null
}
```