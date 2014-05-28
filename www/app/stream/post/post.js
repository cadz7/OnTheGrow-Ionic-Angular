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
  ['$log', 'STREAM_CONSTANTS', 'API_CONSTANTS', 'template', 'streamItems', 'streamItemResourceService', '$ionicActionSheet', 'streamItemModalService', 'challenge', 'Notify',
    function ($log, STREAM_CONSTANTS, API_CONSTANTS, template, streamItems, streamItemResourceService, $ionicActionSheet, streamItemModalService, challenge, Notify) {
      return {
        restrict: 'E',
        template: '<div ng-include="streamItemResourceService.getContentUrl(post)"></div>',
        scope: {
          post: '=',
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
              scope.post.newComment = ''; // clears only if the post comment was successful.
            })/*['finally'](function() {})*/;
          };


          scope.showEditMenu = function (theComment) {
            scope.comment = theComment;
            scope.currentPost = scope.post;
            scope.modal.show();
          };

          scope.deletePost = function (item) {
            $ionicActionSheet.show({
              buttons: [
                { text: 'Hide this post' },
                { text: '<strong>Hide all by this user</strong>' },
              ],
              cancelText: 'Cancel',
              buttonClicked: function (index) {
                switch (index) {
                  case 0: // hide current post
                    streamItems.deletePost(item).then(function () {
                        console.log('Your post has been deleted.');
                      }, function (response) {
                        if (response.status === 403) {
                          console.error('You do not have permission to delete this post.');
                        }
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
              streamItemModalService.setStreamItem(scope.post, type);
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

          function getDetails(){
            if (scope.isDetailView()){
              challenge.getChallengeDetails(scope.post.relatedToId)
                .then(function(detail){
                  scope.detail = detail;
                }, function (err){
                  Notify.apiError(err, err);
                });
            }
          };
          getDetails();

        }
      }
    }
  ]
);