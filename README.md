Get require() like node-detective by lexical analysis

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
  'path': 'a',
  'index': 0
}
```