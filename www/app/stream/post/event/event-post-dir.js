'use strict';

angular.module('sproutApp.directives').directive(
	'sproutEventPost',
	['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'template', 'streamItems',
		function($log, STREAM_CONSTANTS, API_CONSTANTS, template, streamItems) {
			return {
				restrict: 'E',
				templateUrl: 'app/stream/post/event/event-post.tpl.html',
				link: function(scope, elem, attrs) {
					scope.STREAM_CONSTANTS = STREAM_CONSTANTS; // make accessible to view

			    scope.showCommentCount = STREAM_CONSTANTS.initialCommentCountShown;
			    scope.commentsExist = !!(scope.post.comments && scope.post.comments.length);
			    scope.liked = false;

			    var postContent = template.fill(scope.post.streamItemDisplay.template, scope.post.streamItemDisplay.values),
			    		contentIsOverflowing = postContent.length > STREAM_CONSTANTS.initialPostCharCount;

			    if (contentIsOverflowing) {
			    	if (scope.arg === 'full') {
			    		scope.content = postContent;
			    	}
			    	else {
				    	var tempContent = postContent.substr(0, STREAM_CONSTANTS.initialPostCharCount);
				    	scope.content = (postContent.charAt(tempContent.length) != ' ') ? tempContent + '...' : tempContent.substr(0, tempContent.lastIndexOf(' ')) + ' ...';
			    	}
			    }
			    else {
			    	scope.content = postContent;
			    }

			    scope.contentIsOverflowing = contentIsOverflowing;

			    scope.isEditable = function() {
			      if (!scope.user || !scope.post || !scope.post.author_id) { return false; }

			      return scope.user && scope.user.id.toString() === scope.post.author_id.toString();
			    };

			    scope.showAllComments = function() {
			      if (scope.showCommentCount === scope.post.comments.length) {
			        scope.showCommentCount = STREAM_CONSTANTS.initialCommentCountShown;
			        return;
			      }

			      if (scope.post.comments.length === scope.post.comments.length) {
			        scope.showCommentCount = scope.post.comments.length;
			        return;
			      }

			      stream.getPost(scope.post.id, true, true).then(function(post) {
			        scope.post.comments = post.comments;
			        scope.showCommentCount = post.comments.length;
			      }, function() {
			        console.error('Failed to get comments');
			      })['finally'](function() {
//			        Scene.ready(scope);
			      });
			    };

			    if (!angular.isNumber(scope.post.likeCount)) { scope.post.likeCount = 0; }

			    scope.likePost = function(post) {
			      post[post.viewer.isLikedByViewer ? "unlikePost" : "likePost"]().then(
			      	function() {
			      		$log.debug("success toggling like");
			      	},
			      	function(err) {
			      		$log.error(err);
			      	}
			      )
			    };

			    scope.deleteComment = function(comment) {
			      PostCacheSvc.delete(comment).then(function() {
			        Notify.userSuccess('', 'Comment deleted.');
			        scope.post.comments = _.without(scope.post.comments, comment);
			        scope.post.comments.length -= 1;
			        if (!scope.post.comments && !scope.post.comments.length) {
			          scope.commentsExist = false;
			        }
			      });
			    };

			    scope.postComment = function(commentText) {
			      scope.post.postComment(commentText).then(function(comment) {
			        $log.debug('Comment posted: ', comment);
			        scope.commentsExist = true;
			        scope.showCommentCount += 1;
			        scope.commentText = ''; // clears only if the post comment was successful.
			      })/*['finally'](function() {})*/;
			    };

			    
			    scope.showEditMenu = function(theComment) {
			      scope.comment = theComment;
			      scope.currentPost = scope.post;
			      scope.modal.show();
			    };
			    scope.closeModal = function() {
			      scope.modal.hide();
			    };
			    
			    scope.showFullPost = function(theComment) {
			      scope.comment = theComment;
			      scope.dialog.scope.currentPost = scope.post;
			      scope.dialog.scope.postContent = scope.content;
			      scope.dialog.scope.likePost = scope.likePost;
			      scope.dialog.show();
			    };
			    scope.closeFullPost = function() {
			      scope.dialog.hide();
			    };
			    
				}
			}
		}
	]
);