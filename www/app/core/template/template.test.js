/* globals describe, it, chai, console */

'use strict';
var expect = chai.expect;
describe('template service', function() {
  var template;
  beforeEach(module('sproutApp.template'));
  beforeEach(function() {
    template = testUtils.getService('template');
  });

  it('should fill a message with a simple key', function () {
    var values = {
      bar: 42
    };
    var result = template.fill('The ultimate answer is {bar}.', values);
    expect(result).to.equal('The ultimate answer is 42.');
  });

  it('should fill a message with a nested key', function () {
    var values = {
      bar: {
        baz: {
          quux: 42
        }
      }
    };
    var result = template.fill('The ultimate answer is {bar.baz.quux}.', values);
    expect(result).to.equal('The ultimate answer is 42.');
  });

  it('should substitute escaped braces', function () {
    var values = {
      bar: 42
    };
    var result = template.fill('The ultimate \\{answer\\} is {bar}.', values);
    expect(result).to.equal('The ultimate {answer} is 42.');
  });

  it('should throw an error when running into a undefined key', function () {
    var template = testUtils.getService('template');
    var values = {};
    function run() {
      var result = template.fill('The ultimate answer is {bar.baz.quux}.', values);
    }
    expect(run).to.throw(/No matching value/);
  });

});