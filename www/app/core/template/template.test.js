/* globals describe, it, chai, console */

'use strict';
var expect = chai.expect;
describe('template service', function() {
  // Load the module
  beforeEach(module('sproutApp.template'));

  it('template service should get loaded', function () {
    var template = testUtils.getService('templateParser');
    expect(template).to.not.be.undefined;
  });

  it('should parse test message', function () {
    var template = testUtils.getService('templateParser');
    var parsedString = template.fill("foo <%=bar%> baz", {bar: 42});
    expect(parsedString).to.equal("foo 42 baz");
  });

});