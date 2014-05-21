'use strict';

angular.module('sproutApp.directives').directive(
	'sproutComment',
	['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'template',
		function($log, STREAM_CONSTANTS, API_CONSTANTS, template) {
			return {
				restrict: 'E',
				templateUrl: 'app/stream/comment/comment.tpl.html',
				link: function(scope, elem, attrs) {
			    scope.parsedContent = template.fill(scope.comment.commentDisplay.template, scope.comment.commentDisplay.values);

          //contentIsOverflowing
          scope.contentIsOverflowing = function(){
            return false; // TODO implement
          };

          //showFullPost
          scope.showFullPost = function(){
            return;// TODO implement
          };

          //isEditable
          scope.isEditable = function(){
            return; // TODO implement
          }
				}
			}
		}
	]
);
