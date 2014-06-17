Get require() like node-requires by lexical analysis

[![NPM version](https://badge.fury.io/js/searequire.png)](https://npmjs.org/package/searequire)

===


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