/* globals describe, it, chai, console */

'use strict';
var expect = chai.expect;
describe('template-parser service', function() {
  var mockData = {};

  // Load the module
  beforeEach(module('sproutApp.data.template-parser'));

  // Provide mocks
  beforeEach(module(function($provide) {
    $provide.factory('$q', function() {
      return Q;
    });

    $provide.factory('user', function () {
      return {
        data: {}
      };
    });
  }));

  // Reset mock data;
  beforeEach(function() {
    mockData = {};
  });

  it('template-parser service should get loaded', function () {
    var templateParser = testUtils.getService('templateParser');
    expect(templateParser).to.not.be.undefined;
  });

  it('should parse test message', function () {
    var templateParser = testUtils.getService('templateParser');
    var parsedString = templateParser.parse("Be <%=user.name%>", {user: {name: "Arthur"}});
    expect(parsedString).to.equal("Be Arthur");
  });

  it('should parse second test message', function () {
    var templateParser = testUtils.getService('templateParser');
    var parsedString = templateParser.parse("Be not <%=user.name%>", {user: {name: "Arthur2"}});
    expect(parsedString).to.equal("Be not Arthur2");
  });
});