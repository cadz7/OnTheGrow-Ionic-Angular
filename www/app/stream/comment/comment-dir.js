'use strict';

angular.module('sproutApp.directives').directive(
	'sproutComment',
	['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'templateParser',
		function($log, STREAM_CONSTANTS, API_CONSTANTS, templateParser) {
			return {
				restrict: 'E',
				templateUrl: 'app/stream/comment/comment.tpl.html',
				link: function(scope, elem, attrs) {
			    scope.parsedContent = templateParser.parse(scope.comment.commentDisplay.template, scope.comment.commentDisplay.values);
				}
			}
		}
	]
);