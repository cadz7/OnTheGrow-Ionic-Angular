/* globals describe, it, chai, console */

'use strict';
var expect = chai.expect;
describe('server service', function() {
  var server;
  beforeEach(module('sproutApp.server'));
  beforeEach(function() {
    server = testUtils.getService('server');
  });

  it('should load', function () {
    expect(server).to.not.be.undefined;
  });
});