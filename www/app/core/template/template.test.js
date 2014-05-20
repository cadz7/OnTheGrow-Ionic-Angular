/* globals describe, it, chai, console */

'use strict';
var expect = chai.expect;
describe('template service', function() {
  // Load the module
  beforeEach(module('sproutApp.template'));

  it('template service should get loaded', function () {
    var template = testUtils.getService('template');
    expect(template).to.not.be.undefined;
  });

  it('should fill a message with a simple key', function () {
    var template = testUtils.getService('template');
    var values = {
      bar: 42
    };
    var result = template.fill('The ultimate answer is {bar}.', values);
    expect(result).to.equal('The ultimate answer is 42.');
  });

  it('should fill a message with a nested key', function () {
    var template = testUtils.getService('template');
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

});