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
});