'use strict';

angular.module('sproutApp.directives').directive(
	'sproutPost',
	['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS',
		function($log, STREAM_CONSTANTS, API_CONSTANTS) {
			return {
				restrict: 'E',
				templateUrl: 'app/stream/post/post.tpl.html',
				link: function(scope, elem, attrs) {
					scope.STREAM_CONSTANTS = STREAM_CONSTANTS; // make accessible to view

			    scope.showCommentCount = STREAM_CONSTANTS.initialCommentCountShown;
			    scope.commentsShown = !!(scope.post.comments && scope.post.comments.length);
			    scope.liked = false;

			    var contentIsOverflowing = scope.post.content.length > STREAM_CONSTANTS.initialPostCharCount;

			    if (contentIsOverflowing) {
			    	if (scope.arg === 'full') {
			    		scope.content = scope.post.content;
			    	}
			    	else {
				    	var tempContent = scope.post.content.substr(0, STREAM_CONSTANTS.initialPostCharCount);
				    	scope.content = (scope.post.content.charAt(tempContent.length) != ' ') ? tempContent + '...' : tempContent.substr(0, tempContent.lastIndexOf(' ')) + ' ...';
			    	}
			    }
			    else {
			    	scope.content = scope.post.content;
			    }

			    scope.contentIsOverflowing = contentIsOverflowing;

			    scope.isEditable = function() {
			      if (!scope.user || !scope.post || !scope.post.author_id) { return false; }

			      return scope.user && scope.user.id.toString() === scope.post.author_id.toString();
			    };

			    scope.showAllComments = function() {
			      if (scope.showCommentCount === scope.post.commentCount) {
			        scope.showCommentCount = STREAM_CONSTANTS.initialCommentCountShown;
			        return;
			      }

			      if (scope.post.commentCount === scope.post.comments.length) {
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

			    scope.likeClicked = function(postId) {
			      if (scope.post.userLikedId) {
			        // fire delete
			        $log.debug('deleting like of post', postId);
			        Like.delete({
			          'type_id': API_CONSTANTS.streamitemTypeId,
			          'item_id': scope.post.id,
			          'id': scope.post.userLikedId
			        }).then( function() {
			          scope.post.likeCount = scope.post.likeCount - 1;
			          delete scope.post.userLikedId;
			        }, function(error) {
			          $log.error(error);
			        });
			      }
			      else if (scope.user && scope.user.id) {
			        // fire post
			        $log.debug('Liking post', scope.post);
			        
			        var newLike = Like.new(
			          {
			            'type_id': API_CONSTANTS.streamitemTypeId,
			            'item_id': scope.post.id,
			            'from_user_id': scope.user.id,
			            'to_user_id': scope.post.author_id
			          }
			        );
			        
			        newLike.$save().then(function(response) {
			          $log.debug('Saved like', response); // we already incremented the counter below, we don't do it here
			          scope.post.userLikedId = response.id;
			        }, function(error) {
			          $log.error('Failed to like post: ', error);
			          scope.post.likeCount -= 1;
			          Notify.apiError('', 'Liking post failed.');
			          delete scope.post.userLikedId;
			        });

			        // increment the counter without waiting for response
			        scope.post.likeCount = scope.post.likeCount + 1;
			      }
			    };

			    scope.deleteComment = function(comment) {
			      PostCacheSvc.delete(comment).then(function() {
			        Notify.userSuccess('', 'Comment deleted.');
			        scope.post.comments = _.without(scope.post.comments, comment);
			        scope.post.commentCount -= 1;
			        if (!scope.post.comments && !scope.post.comments.length) {
			          scope.commentsShown = false;
			        }
			      });
			    };

			    scope.postComment = function(commentText) {
			      $log.debug('postCommentDecorator()', commentText);
			      Scene.block(scope);
			      PostCacheSvc.postComment(scope.user, scope.post, commentText).then(function(comment) {
			        $log.debug('Comment posted: ', comment);
			        Notify.userSuccess('', 'Your comment has been posted.');
			        scope.commentsShown = true;
			        scope.showCommentCount += 1;
			        scope.post.commentCount += 1;
			        scope.commentText = ''; // clears only if the post comment was successful.
			      })['finally'](function() {
			        Scene.ready(scope);
			      });
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