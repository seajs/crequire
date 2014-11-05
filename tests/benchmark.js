var crequire = require('../');
var detective = require('detective');

var Benchmark = require('benchmark');

var tests = {
  'normal': 'require("a");require(\'b"\');require("c\\"")',
  'reg & comment': '(1)/*\n*/ / require("a")',
  'after return': "return require('highlight.js').highlightAuto(code).value;",
  'in quote': '"require(\'a\')"',
  'in comment': '//require("a")',
  'in multi comment': '/*\nrequire("a")*/',
  'in reg': '/require("a")/',
  'in ifstmt with no {}': 'if(true)/require("a")/',
  'in dostmt with no {}': 'do /require("a")/.test(s); while(false)',
  'reg / reg': '/require("a")/ / /require("b")',
  'ignore variable': 'require("a" + b)'
};
var results = {
  'normal': 3,
  'reg & comment': 1,
  'after return': 1,
  'in quote': 0,
  'in comment': 0,
  'in multi comment': 0,
  'in reg': 0,
  'in ifstmt with no {}': 0,
  'in dostmt with no {}': 0,
  'reg / reg': 0,
  'ignore variable': 0
};

Object.keys(tests).forEach(function(key) {
  var suite = new Benchmark.Suite;
  var s = tests[key];
  // add tests
  suite.add('crequire: ' + key, function() {
      crequire(s).length === results[key];
    }).add('detective: ' + key, function() {
      detective(s).length === results[key];
    })
  // add listeners
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('  Fastest is ' + this.filter('fastest').pluck('name').toString().replace(/:.*/, ''));
    })
    .run();
});