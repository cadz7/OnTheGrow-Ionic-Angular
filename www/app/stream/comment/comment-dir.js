'use strict';

angular.module('sproutApp.directives').directive(
	'sproutComment',
	['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS',
		function($log, STREAM_CONSTANTS, API_CONSTANTS) {
			return {
				restrict: 'E',
				templateUrl: 'app/stream/comment/comment.tpl.html',
				link: function(scope, elem, attrs) {
			    
				}
			}
		}
	]
);