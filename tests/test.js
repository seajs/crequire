var searequire = require('../');

var expect = require('expect.js');

describe('get the right deps', function() {
  var s = 'require("a");require(\'b"\');require("c\\"")';
  var res = searequire(s);
  it('string', function() {
    expect(res.map(function(o) {
      return o.string
    })).to.eql(['require("a")', 'require(\'b"\')', 'require("c\\"")']);
  });
  it('path', function() {
    expect(res.map(function(o) {
      return o.path
    })).to.eql(['a', 'b"', 'c\\"']);
  });
  it('index', function() {
    expect(res.map(function(o) {
      return o.index
    })).to.eql([0, 13, 27]);
  });
  it('use replace', function() {
    var s = 'require("a");require("b");';
    var res = searequire(s, function(require) {
      return 'require("woot/' + require.path + '")'
    });
    expect(res).to.eql('require("woot/a");require("woot/b");');
  });
  it('reg & comment', function() {
    var s = '(1)/*\n*/ / require("a")';
    var res = searequire(s, true).map(function(o) {
      return o.path
    });
    expect(res).to.eql(["a"]);
  });
  it('include async', function() {
    var s = 'require.async("a")';
    var res = searequire(s, function(o) {
      return 'require.async(1)'
    }, true);
    expect(res).to.eql('require.async(1)');
  });
  it('async flag', function() {
    var s = 'require.async("a")';
    var res = searequire(s, function(o) {
      return o.flag
    }, true);
    expect(res).to.eql('.async');
  });
  it('custom flag', function() {
    var s = 'require.custom("a")';
    var res = searequire(s, function(o) {
      return o.flag
    }, true);
    expect(res).to.eql('.custom');
  });
  it('return', function() {
    var s = "return require('highlight.js').highlightAuto(code).value;";
    var res = searequire(s);
    expect(res.length).to.eql(1);
  });
  it('callback', function() {
    var s = 'require.async("slider", function(){\nalert("loaded");\n});';
    var res = searequire(s, true);
    expect(res.length).to.eql(1);
  });
  it('block & reg 1', function() {
    var s = '({}/require("a"))';
    var res = searequire(s);
    expect(res.length).to.eql(1);
  });
  it('block & reg 2', function() {
    var s = 'return {}/require("a")';
    var res = searequire(s);
    expect(res.length).to.eql(1);
  });
  it('block & reg 3', function() {
    var s = 'v={}/require("a")';
    var res = searequire(s);
    expect(res.length).to.eql(1);
  });
});
describe('ignores', function() {
  it('in quote', function() {
    var s = '"require(\'a\')"';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('in comment', function() {
    var s = '//require("a")';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('in multi comment', function() {
    var s = '/*\nrequire("a")*/';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('in reg', function() {
    var s = '/require("a")/';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('in ifstmt with no {}', function() {
    var s = 'if(true)/require("a")/';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('in dostmt with no {}', function() {
    var s = 'do /require("a")/.test(s); while(false)';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('reg / reg', function() {
    var s = '/require("a")/ / /require("b")';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('ignore variable', function() {
    var s = 'require("a" + b)';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('unend string', function() {
    var s = 'require("a';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('unend comment', function() {
    var s = '/*';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('unend reg', function() {
    var s = '/abc';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('ignore async', function() {
    var s = 'require.async("a")';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('block & reg 1', function() {
    var s = '{}/require("a")/';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('block & reg 2', function() {
    var s = 'return\n{}/require("a")/';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('block & reg 3', function() {
    var s = '()=>{}/require("a")/';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('block & reg 4', function() {
    var s = '(1)\n{}/require("a")/';
    var res = searequire(s);
    expect(res.length).to.eql(0);
  });
  it('require /**/', function() {
    var s = 'require/**/("a")';
    var res = searequire(s, true).map(function(o) {
      return o.path
    });
    expect(res).to.eql(["a"]);
  });
  it('require. /**/', function() {
    var s = 'require.async/**/("a")';
    var res = searequire(s, true).map(function(o) {
      return o.path
    });
    expect(res).to.eql(["a"]);
  });
  it('require /**/ .', function() {
    var s = 'require/**/.async("a")';
    var res = searequire(s, true).map(function(o) {
      return o.path
    });
    expect(res).to.eql(["a"]);
  });
  it('require /**/ . /**/', function() {
    var s = 'require/**/.async/**/("a")';
    var res = searequire(s, true).map(function(o) {
      return o.path
    });
    expect(res).to.eql(["a"]);
  });
});
describe('callback', function() {
  it('none', function() {
    var s = 'test("a")';
    var res = searequire(s, function() {
      return '1';
    });
    expect(res).to.eql(s);
  });
  it('one', function() {
    var s = 'require("a")';
    var res = searequire(s, function() {
      return '1';
    });
    expect(res).to.eql('1');
  });
  it('tow', function() {
    var s = 'require("a");require("b");';
    var res = searequire(s, function(item) {
      return item.path;
    });
    expect(res).to.eql('a;b;');
  });
  it('same length as item', function() {
    var s = 'require("a");require("b");';
    var res = searequire(s, function(item) {
      return '123456789012';
    });
    expect(res).to.eql('123456789012;123456789012;');
  });
});