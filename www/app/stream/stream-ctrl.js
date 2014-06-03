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
      sharingService
    ) {

    	$scope.stream = streamItems;

    	$scope.header = headerRemote;
    	$scope.filterByType = 'ALL';
      $scope.streamItemFilter = null;

      var hideModal = function(modalScope) {
            modalScope.hide();
          };

      $scope.cancelCreatePost = function(post) {
        if (post.text.length > 0) {
          // A confirm dialog
          uiConfirmation.prompt({
            destructiveText: 'Discard',
            cancelText: 'Cancel'
          }).then( function(res) {
            switch (res.type) {
              case 'DESTRUCTIVE':
                post.text = '';
                closeCreatePostModal();
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

      $scope.performInfiniteScroll = _.throttle(function() {
        $scope.$evalAsync(function() {
          $log.debug('Running performInfiniteScroll');
          streamItems.getEarlier($scope.streamItemFilter).then(function() {
            $scope.showNoConnectionScreen = false;
            ifNoStreamItemsShowReloadScreen();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
          .then(null, function error() {
            showNoConnectionScreen();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });
      }, 1000);

      $scope.refresh = function() {
        streamItems.reload($scope.streamItemFilter).then(function() {
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
      // Create child scopes to hold streaItem data (passed in when modal is opened)
      var createStreamItemModalScope = $scope.$new(),
          shareStreamItemModalScope = $scope.$new(),
          createActivityModalScope = $scope.$new(),
          editStreamItemModalScope = $scope.$new(),
          streamItemModalScope = $scope.$new();

      createStreamItemModalScope.showKeyboard = true;

      shareStreamItemModalScope.sharingTargets = sharingService.sharingTargets;

      shareStreamItemModalScope.shareTargetSelected = function(target) {
        shareStreamItemModalScope.selectedTarget = target;
      };
      shareStreamItemModalScope.selectedTarget = null;

      $scope.chooseSharingTargets = function() {
        $scope.shareStreamItemModal.show();
      }

      // Modal for create-post
      $ionicModal.fromTemplateUrl('app/stream/post/modal/create-post-modal.tpl.html', {
        scope: createStreamItemModalScope,
        animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function(modal) {
        $scope.createStreamItemModal = modal;
      });

      // Modal for share-post
      $ionicModal.fromTemplateUrl('app/stream/post/modal/share-post-modal.tpl.html', {
        scope: shareStreamItemModalScope,
        animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function(modal) {
        $scope.shareStreamItemModal = modal;
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
        $scope.shareStreamItemModal.remove();
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

      $scope.sharePost = function(target) {
        if (target) {
          $scope.shareWith = target;
          hideModal($scope.shareStreamItemModal);
        }
      };

      $scope.cancelSharePost = function(target) {
        hideModal($scope.shareStreamItemModal);
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

      $scope.createActivity = function() {
        $scope.createActivityModal.show();
      };

      $scope.showFilterOptions = function() {
        streamUIService.pickFilter()
          .then(function(streamItemFilter){
            $log.debug('user picked filter', streamItemFilter);
            $scope.streamItemFilter = streamItemFilter;
            $scope.refresh();
            //TODO: scroll to top.
          });
      };
      //
      // REFRESH STREAM ITEMS HERE
      //
      $scope.onRefreshPullDown = function() {
        streamItems.getUpdate().then(function(data) {
          $scope.updatePresent = data && data.length;
          $scope.$broadcast('scroll.refreshComplete');        
        });
      };

      $scope.$evalAsync(function() {
        $scope.onRefreshPullDown();
      });
    }
  ]
);
