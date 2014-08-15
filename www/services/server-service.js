angular.module('OnTheGrow.services')

.constant('SERVER_URL', 'http://mighty-woodland-4484.herokuapp.com') 
/* Service to interact between middleware and Front-End */
.factory('server', ['$resource', 'SERVER_URL',
 function($resource, SERVER_URL) {
		return $resource(SERVER_URL + '/api/lists/:_id');
  }]);
