var testUtils = {};

testUtils.getService = function(serviceName) {
  var service;
  inject([serviceName, function(injectedService) {
    service = injectedService;
  }]);
  return service;
};
