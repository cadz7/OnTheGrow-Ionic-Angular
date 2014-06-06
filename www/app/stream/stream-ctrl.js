'use strict';

angular.module('sproutApp.controllers')
.controller(
  'StreamCtrl',
  [
    '$scope',
    'streamItems',
    '$ionicModal',
    'headerRemote',
    'uiConfirmation',
    '$log',
    'streamItemModalService',
    'Notify',
    'joinableStreamItemService',
    'networkInformation',
    'streamUIService',
    '$ionicScrollDelegate',
    'sharingService',
    'filters',
    '$timeout',
    'APP_CONFIG',
    'joinService',
    function(
      $scope,
      streamItems,
      $ionicModal,
      headerRemote,
      uiConfirmation,
      $log,
      streamItemModalService,
      Notify,
      joinableStreamItemService,
      networkInformation,
      streamUIService,
      $ionicScrollDelegate,
      sharingService,
      filters,
      $timeout,
      APP_CONFIG,
      joinService
    ) {
    	$scope.APP_CONFIG = APP_CONFIG;
    	$scope.stream = streamItems;
    	$scope.header = headerRemote;
      $scope.selectedStreamItemFilter = null;
      $scope.showStreamItemFilters = false;

      $scope.updatePresent = null;

      filters.whenReady()
      .then(function() {
        $scope.streamItemFilters = filters.streamItemFilters;
        $scope.selectedStreamItemFilter = filters.streamItemFilters[0];
      });

      var hideModal = function(modalScope) {
            modalScope.hide();
          };

      $scope.cancelCreatePost = function(post) {
        if (post.text.length > 0) {
          // A confirm dialog
          uiConfirmation.prompt({
            titleText: 'Are you sure you want discard the post?',
            buttons: [{text: 'Discard'}],
            cancelText: 'Cancel'
          }).then( function(res) {
            switch (res.type) {
              case 'BUTTON':
                // there is only one button - discard
                post.text = '';
                hideModal($scope.createStreamItemModal);
                break;
              case 'CANCELLED':
                break;
            }
          });
        }
        else {
          hideModal($scope.createStreamItemModal);
        }
      };

      $scope.closeCreateActivityModal = function() {
        hideModal($scope.createActivityModal);
      };

    	$scope.closeModal = function() {
    		hideModal($scope.editStreamItemModal);
    	};

      $scope.closeFullPost = function() {
        hideModal($scope.streamItemModal);
      };

      function ifNoStreamItemsShowReloadScreen() {
        if (!$scope.stream.items || !$scope.stream.items.length) {
          $log.debug('No Stream Items Were Found.');
          $scope.status = 'NO_STREAM_ITEMS_FOUND';
        } else {
          $scope.status = 'OK';
        }
      }

      function showNoConnectionScreen() {
        if (!$scope.stream.items || !$scope.stream.items.length) {
          $log.debug('No Connection Screen Shown');
          $scope.status = 'NO_CONNECTION';
        } else {
          $scope.status = "OK";
        }
      }

      function offlineAndOutOfStreamItems(showMsg) {
        $scope.showOfflineMsg = showMsg;
      }

      $scope.performInfiniteScroll = _.throttle(function() {
        $scope.$evalAsync(function() {
          $log.debug('Running performInfiniteScroll');
          streamItems.getEarlier($scope.selectedStreamItemFilter).then(function() {
            $scope.showNoConnectionScreen = false;
            ifNoStreamItemsShowReloadScreen();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            offlineAndOutOfStreamItems(false);
          })
          .then(null, function error(err) {
            showNoConnectionScreen();
            if (err == 'offline') {
              offlineAndOutOfStreamItems(true);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });
      }, 1000);

      $scope.refresh = function() {
        streamItems.reload($scope.selectedStreamItemFilter).then(function() {
          $scope.showNoConnectionScreen = false;
          $ionicScrollDelegate.scrollTop(false);
          ifNoStreamItemsShowReloadScreen();
        }, function error(response) {
          showNoConnectionScreen();
          Notify.apiError('Failed to fetch any stream items!');
          $log.error(response);
        });
      };
      //$scope.refresh();
      $scope.post = {
        newComment : ''
      };
      // Create child scopes to hold streaItem data (passed in when modal is opened)
      var createStreamItemModalScope = $scope.$new(),
          createActivityModalScope = $scope.$new(),
          editStreamItemModalScope = $scope.$new(),
          streamItemModalScope = $scope.$new();

      createStreamItemModalScope.showKeyboard = true;

      sharingService.fetchSharingTargets().then( function() {
        $scope.shareWith = sharingService.sharingTargets[0];
      });

      // This flag toggles the sharing menu
      $scope.userSelectingSharingTargets = false;

      // This is called when you want to toggle the sharing menu
      $scope.selectSharingTargets = function() {
        if ($scope.userSelectingSharingTargets) {
          $scope.userSelectingSharingTargets = false;
        }
        else {
          $scope.sharingTargets = sharingService.sharingTargets;
          $scope.userSelectingSharingTargets = true;
        }
      };

      // This is called when you select some group to share with from the list
      $scope.shareTargetSelected = function(target) {
        $scope.userSelectingSharingTargets = false;
        $scope.shareWith = target;
      }

      // Modal for create-post
      $ionicModal.fromTemplateUrl('app/stream/post/modal/create-post-modal.tpl.html', {
        scope: createStreamItemModalScope,
        animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function(modal) {
        $scope.createStreamItemModal = modal;
      });


      // Modal for create-activity
      $ionicModal.fromTemplateUrl('app/stream/post/modal/create-activity-modal.tpl.html', {
        scope: createActivityModalScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.createActivityModal = modal;
      });

      // Action-sheet for edit-post
      $ionicModal.fromTemplateUrl('app/stream/post/modal/edit-post-modal.tpl.html', {
        scope: editStreamItemModalScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.editStreamItemModal = modal;
      });

      // Modal for full-post
      $scope.makeFullPostModal = function(){
        $ionicModal.fromTemplateUrl('app/stream/post/modal/full-post-modal.tpl.html', {
          scope: streamItemModalScope,
          animation: 'slide-in-up',
          backdropClickToClose: false
        }).then(function(modal) {
          $scope.streamItemModal = modal;
          streamItemModalService.modal = modal;
          streamItemModalScope.streamItemModalService = streamItemModalService;
          streamItemModalScope.joinableStreamItemService = joinableStreamItemService;

        });
      };
      $scope.makeFullPostModal();


      // Clean up modals when scope is destroyed
      $scope.$on('$destroy', function() {
        $scope.createStreamItemModal.remove();
        $scope.createActivityModal.remove();
        $scope.editStreamItemModal.remove();
        $scope.streamItemModal.remove();
      });

      $scope.newPost = {
        text: ''
      };

      $scope.submitPost = function(post) {
        if (post.text.length > 0) {

          if ($scope.shareWith) {
            post.shareWithFilterId = $scope.shareWith.filterId;
          }

          streamItems.postItem(post)
          .then(function() {
            Notify.userSuccess('Your post has been sent!');
            $scope.newPost.text = '';
            hideModal($scope.createStreamItemModal);
          }, Notify.notifyTheCommonErrors(function(response) {
            Notify.apiError(Notify.errorMsg.POST_FAILED_TO_SEND);
            throw response;
          })
        )
          .then(null, $log.error);
        }
      };

      $scope.createPost = function() {
        if (!networkInformation.isOnline) {
          Notify.userError('You cannot post in offline mode.');
        } else {
          $scope.createStreamItemModal.show().then(function() {
            SoftKeyboard.show();
          });
        }
      };

      $scope.postComment = function (commentText) {
        var currentPost = streamItemModalService.getStreamItem();
        currentPost.postComment(commentText).then(function (comment) {
            $log.debug('Comment posted: ', comment);
            $scope.post = {
              newComment: ''
            };
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

      $scope.createActivity = function() {
        $scope.createActivityModal.show();
      };

      $scope.toggleStreamItemFilters = function(){
        $scope.showStreamItemFilters = !$scope.showStreamItemFilters;
      };

      //apply the selected streamItem type filter
      $scope.selectStreamItemFilter = function(filter){
        $scope.toggleStreamItemFilters();
        $scope.streamItemFilters = filters.streamItemFilters;
        $scope.selectedStreamItemFilter = filter;
        $timeout( function() {
          $scope.refresh();
        }, 16);
      };

      $scope.showSubStreamItemFilters = function(filter){
        $scope.streamItemFilters = filter.subFilters;
      }

      /*$scope.showFilterOptions = function() {
        streamUIService.pickFilter()
          .then(function(selectedStreamItemFilter){
            $log.debug('user picked filter', selectedStreamItemFilter);
            $scope.selectedStreamItemFilter = selectedStreamItemFilter;
            $scope.refresh();
            //TODO: scroll to top.
          });
      };*/

      $scope.applyNewItems = function() {
        streamItems.applyUpdate();
        $ionicScrollDelegate.scrollTop();
        $scope.updatePresent = false;
      }
      //
      // REFRESH STREAM ITEMS HERE
      //
      $scope.onRefreshPullDown = function() {
        streamItems.getUpdate().then(function(data) {
          $scope.updatePresent = data && data.length;

          $scope.$broadcast('scroll.refreshComplete');
        });
      };

      networkInformation.onOnline(function() {
        streamItems.getUpdate().then(function(data) {
          $scope.updatePresent = data && data.length;
        });
      })

      /*$scope.$evalAsync(function() {
        $scope.onRefreshPullDown();
      });*/

      $scope.show = function() {
        $ionicLoading.show({
          template: 'Loading...'
        });
      };
      $scope.hide = function() {
        $ionicLoading.hide();
      };







      ///////////// STREAM HANDLERS /////////////
      var streamHandlers = {};

      $scope.closeStreamItemModal = function(){
        $scope.streamItemModal2.remove();
        streamItemModalService.cleanUp();
      };

      function openModal(){
        if (!$scope.streamItemModal2 || !$scope.streamItemModal2.isShown()){
          $ionicModal.fromTemplateUrl('app/stream/stream-item-modal-wrapper.html', {
            animation: 'slide-in-up',
            scope: $scope
          }).then(function(modal) {
            $scope.streamItemModal2 = modal;
            $scope.streamItemModal2.show();
          });
        }
      }

      streamHandlers.showDetails = function(streamItem){
        streamItemModalService.loadStreamItemDetails(streamItem, streamItemModalService.DETAILED_VIEW);
        openModal();
      };

      streamHandlers.showComments = function(streamItem){
        streamItemModalService.loadStreamItemDetails(streamItem, streamItemModalService.COMMENTS_VIEW);
        openModal();
      };

      streamHandlers.toggleMembership = function(streamItem){
        if (streamItem.viewer.isMember) {
          // don't do anything now, but perhaps leave group
          $log.debug('Unable to do anything for join button');
        } else {
          // subscribe user
          $log.debug('User is going to join some joinable-thing');
          joinService.join(streamItem)
            .then(function (res) {
              // Refresh the post
              if (res && res === 'userCanceled'){
                $log.info('Canceled join group');
              } else {
                // TODO YT refresh streamItem on the dom to show that it has been joined
              }
            }, function (err) {
              Notify.apiError('Unable to join group', err)
            })
            .then(function (updatedStreamItem) {
            }, function (err) {
              Notify.apiError('Unable to refresh post', err)
            });
        }
      };

      streamHandlers.postComment = function(streamItem, streamItemInputId){
        var commentTxt = document.getElementById(streamItemInputId).value;
        streamItem.postComment(commentTxt)
          .then(function (comment) {
            $log.debug('Comment posted: ', comment);
            document.getElementById(streamItemInputId).value = '';
            // TODO YT refresh streamItem on the dom to show that a new comment has been posted
          },
          function (err) {
            if (err==='offline') {
              Notify.apiError('You cannot post comments in offline mode...', 'Failed to post a comment!');
            } else {
              Notify.apiError('There was an error communicating with the server.', 'Failed to post a comment!');
              $log.error(err);
            }
          }
        )
      };

      streamHandlers.like = function(streamItem){
        streamItem[streamItem.viewer.isLikedByViewer ? "unlikePost" : "likePost"]().then(
          function () {
            $log.debug("success toggling like");
            // TODO YT refresh streamItem on the dom to show that it is liked
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


      window.handleSproutStreamScrollerClick = function(action, streamItemId, streamItemInputId) {
        $log.debug('handleSproutStreamScrollerClick action: ', action, 'stream item #' + streamItemId);
        var streamItem = streamItems.getStreamItemById(streamItemId)[0];
        streamHandlers[action](streamItem, streamItemInputId);
      };
    }
  ]
);
