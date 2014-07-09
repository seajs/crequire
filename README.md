Get require() like node-requires by lexical analysis
===

[![NPM version](https://badge.fury.io/js/searequire.png)](https://npmjs.org/package/searequire)
[![Build Status](https://secure.travis-ci.org/seajs/searequire.png?branch=master)](https://travis-ci.org/seajs/searequire)


### Installation
```
npm install searequire
```

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
  "index": 0
}
```