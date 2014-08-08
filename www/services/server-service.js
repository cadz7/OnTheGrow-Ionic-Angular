angular.module('OnTheGrow.services')
/* Service to interact between middleware and Front-End */
  .factory('server', ['$resource', function($resource) {
		return $resource('/api/lists/:_id');
  }]);
