'use strict';

/**
 * The directive 'post' is synonymous with stream-item.
 *
 * A post or stream-item is an abstract element that appears on the stream feed.
 *
 * A post can be the following:
 *  - group (joinable)
 *  - event (joinable)
 *  - challenge (joinable)
 *  - custom (a.k.a message)
 *  - activity update
 *
 * All posts can do the following:
 * - be liked
 * - be commented on
 * - be hidden/deleted
 * - show more details (on a separate modal, more on this later...)
 *
 * All joinable post can do the following:
 * - be joined
 * - be left
 *
 * UI Components:
 * - header (avatar, author's name, date)
 * - content (hero image, text)
 * - like/comment
 * - comments w/ comment box
 *
 * A post, when is clicked to view more details, will be opened in a modal. It actually
 * becomes wrapped in a modal.
 *
 */
angular.module('sproutApp.directives').directive(
  'post',
  ['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'template', 'streamItems', 'streamItemResourceService',
    function ($log, STREAM_CONSTANTS, API_CONSTANTS, template, streamItems, streamItemResourceService) {
      return {
        restrict: 'E',
        template: '<div ng-include="streamItemResourceService.getContentUrl(post)"></div>',
        scope: {
          post: '=',
          modalContainer: '=',
          isWrappedInModal: '='
        },
        link: function (scope, elem, attrs) {
          scope.STREAM_CONSTANTS = STREAM_CONSTANTS; // make accessible to view
          scope.streamItemResourceService = streamItemResourceService;
          
          scope.showCommentCount = scope.isWrappedInModal ? scope.post.comments.length : STREAM_CONSTANTS.initialCommentCountShown;

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

          scope.isEditable = function () {
            if (!scope.user || !scope.post || !scope.post.author_id) {
              return false;
            }

            return scope.user && scope.user.id.toString() === scope.post.author_id.toString();
          };

          scope.showAllComments = function () {
            if (scope.showCommentCount === scope.post.comments.length) {
              scope.showCommentCount = STREAM_CONSTANTS.initialCommentCountShown;
              return;
            }

            if (scope.post.comments.length === scope.post.comments.length) {
              scope.showCommentCount = scope.post.comments.length;
              return;
            }

            stream.getPost(scope.post.id, true, true).then(function (post) {
              scope.post.comments = post.comments;
              scope.showCommentCount = post.comments.length;
            }, function () {
              console.error('Failed to get comments');
            })['finally'](function () {
//			        Scene.ready(scope);
            });
          };

          if (!angular.isNumber(scope.post.likeCount)) {
            scope.post.likeCount = 0;
          }

          scope.likePost = function (post) {
            post[post.viewer.isLikedByViewer ? "unlikePost" : "likePost"]().then(
              function () {
                $log.debug("success toggling like");
              },
              function (err) {
                $log.error(err);
              }
            )
          };

          scope.deleteComment = function (comment) {
            PostCacheSvc.delete(comment).then(function () {
              Notify.userSuccess('', 'Comment deleted.');
              scope.post.comments = _.without(scope.post.comments, comment);
              scope.post.comments.length -= 1;
              if (!scope.post.comments && !scope.post.comments.length) {
                scope.commentsExist = false;
              }
            });
          };

          scope.postComment = function (commentText) {
            scope.post.postComment(commentText).then(function (comment) {
              $log.debug('Comment posted: ', comment);
              scope.commentsExist = true;
              scope.showCommentCount += 1;
              scope.commentText = ''; // clears only if the post comment was successful.
            })/*['finally'](function() {})*/;
          };


          scope.showEditMenu = function (theComment) {
            scope.comment = theComment;
            scope.currentPost = scope.post;
            scope.modal.show();
          };
          scope.closeModal = function () {
            scope.modal.hide();
          };

          scope.showFullPost = function (theComment) {
            if (scope.modalContainer) {
              // modal has been given, therefore this post is not wrapped
              // into a modal

//            scope.modalContainer.scope.content = scope.content;
//            scope.modalContainer.scope.likePost = scope.likePost;
//            scope.modalContainer.scope.streamItemResourceService = streamItemResourceService;
              scope.modalContainer.scope.post = scope.post; // pass the directive's post to the container's scope
              scope.modalContainer.show();
            } else {
              $log.debug('Trying to open a full post without given a modal container')
            }
            scope.comment = theComment;

          };

        }
      }
    }
  ]
);