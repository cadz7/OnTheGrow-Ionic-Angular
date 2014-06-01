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
 * The
 *
 */
angular.module('sproutApp.directives').directive(
  'post',
  ['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'streamItems', 'streamItemResourceService', '$ionicActionSheet', 'streamItemModalService', 'Notify',
    function ($log, STREAM_CONSTANTS, API_CONSTANTS, streamItems, streamItemResourceService, $ionicActionSheet, streamItemModalService, Notify) {
      return {
        restrict: 'E',
        template: '<div ng-include="streamItemResourceService.getContentUrl(post)"></div>',
        scope: {
          post: '=',
          detail: '=',
          modalContainer: '=',
          viewType: '=',
          isWrappedInModal: '='
        },
        link: function (scope, elem, attrs) {
          scope.STREAM_CONSTANTS = STREAM_CONSTANTS; // make accessible to view
          scope.streamItemResourceService = streamItemResourceService;

          scope.numCommentsDisplayed = scope.isWrappedInModal ? scope.post.comments.length : STREAM_CONSTANTS.initialCommentCountShown;

          scope.commentsExist = !!(scope.post.comments && scope.post.comments.length);
          scope.liked = false;

          scope.contentIsOverflowing = scope.post.content.length > STREAM_CONSTANTS.initialPostCharCount && !scope.isWrappedInModal;

          scope.isEditable = function () {
            if (!scope.user || !scope.post || !scope.post.author_id) {
              return false;
            }

            return scope.user && scope.user.id.toString() === scope.post.author_id.toString();
          };

/* hiding this for now - comment fix
          scope.showAllComments = function () {
            if (scope.numCommentsDisplayed === scope.post.comments.length) {
              scope.numCommentsDisplayed = STREAM_CONSTANTS.initialCommentCountShown;
              return;
            }

            stream.getPost(scope.post.id, true, true).then(function (post) {
              scope.post.comments = post.comments;
              scope.numCommentsDisplayed = post.comments.length;
            }, function () {
              console.error('Failed to get comments');
            })['finally'](function () {
//			        Scene.ready(scope);
            });
          };

          if (!angular.isNumber(scope.post.likeCount)) {
            scope.post.likeCount = 0;
          }*/

          scope.likePost = function (post) {
            post[post.viewer.isLikedByViewer ? "unlikePost" : "likePost"]().then(
              function () {
                $log.debug("success toggling like");
              },
              function (err) {
                if (err==='offline') {
                  Notify.apiError('You cannot like items in offline mode...');
                } else {
                  Notify.apiError('Failed to like post!  Check that you have an internet connection.');
                  $log.error(err);
                }
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
              scope.post.newComment = ''; // clears only if the post comment was successful.
            },
              function (err) {
                if (err==='offline') {
                  Notify.apiError('You cannot post comments in offline mode...', 'Failed to post a comment!');
                } else {
                  Notify.apiError('There was an error communicating with the server.', 'Failed to post a comment!');
                  $log.error(err);
                }
              }
            )};


          scope.showEditMenu = function (theComment) {
            scope.comment = theComment;
            scope.currentPost = scope.post;
            scope.modal.show();
          };

          scope.deletePost = function (item) {
            $ionicActionSheet.show({
              buttons: [
                { text: 'Hide this post' },
//                { text: '<strong>Hide all by this user</strong>' },
              ],
              cancelText: 'Cancel',
              cancel: function(i){},
              buttonClicked: function (index) {
                switch (index) {
                  case 0: // hide current post

                    streamItems.hidePost(item).then(function () {
                        streamItemModalService.hideModal();
                      }, function (response) {
                        Notify.apiError('Failed to delete post!', response.message);
                      }
                    );
                    return true;
                  case 1: // hide all posts of selected user
                    // Send to v1/user
                    return true;
                  default:
                    return true;
                }
              }
            });
          };

          function openPostInModal(type) {
            if (scope.modalContainer) {
              streamItemModalService.loadStreamItemDetails(scope.post, type);
              scope.modalContainer.show();
            } else {
              $log.debug('Trying to open a full post without given a modal container')
            }
          }

          scope.showFullPost = function (theComment) {
            openPostInModal(streamItemModalService.COMMENTS_VIEW);
            scope.comment = theComment;

          };

          /**
           * A detail view of a post typically has more info about the post's subject and no like/commenting (yet).
           *
           * For example, Arthur has joined challenge X. Clicking the title will open challenge X's detailed view.
           */
          scope.showDetailView = function(){
            openPostInModal(streamItemModalService.DETAILED_VIEW);
          };

          scope.isCommentsView = function(){
            return scope.viewType === streamItemModalService.COMMENTS_VIEW;
          };

          scope.isDetailView = function(){
            return scope.viewType === streamItemModalService.DETAILED_VIEW;
          };

        }
      }
    }
  ]
);