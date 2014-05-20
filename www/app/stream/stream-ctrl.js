'use strict';

angular.module('sproutApp.controllers')
.controller(
  'StreamCtrl',
  [
    '$scope', 'streamItems', '$ionicModal', 'headerRemote', '$ionicActionSheet',
    function($scope, streamItems, $ionicModal, headerRemote, $ionicActionSheet) {
    	$scope.stream = streamItems;

    	$scope.header = headerRemote;
    	$scope.filterByType = 'ALL';

    	/*$scope.$on('$stateChangeSuccess', function() {
        $scope.stream.loadData();
      });*/

    	$scope.closeFullPost = function() {
    		$scope.dialog.hide();
    	}

    	$scope.closeModal = function() {
    		$scope.modal.hide();
    	}

      $scope.performInfiniteScroll = _.throttle(function() {
        $scope.$evalAsync(function() {
          streamItems.getEarlier().then(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });
      }, 250);

      var editPostScope = $scope.$new(),
          fullPostScope = $scope.$new();

      fullPostScope.likePost = function(post) {
        post[post.viewer.isLikedByViewer ? "unlikePost" : "likePost"]().then(
          function() {
            $log.debug("success toggling like");
          },
          function(err) {
            $log.error(err);
          }
        )
      };

      $ionicModal.fromTemplateUrl('app/stream/post/edit-post-modal.tpl.html', {
        scope: editPostScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $ionicModal.fromTemplateUrl('app/stream/post/full-post-modal.tpl.html', {
        scope: fullPostScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.dialog = modal;
      });

      $scope.$on('$destroy', function() {
        $scope.modal.remove();
        $scope.dialog.remove();
      });

      $scope.deletePost = function(item) {
      	$ionicActionSheet.show({
          buttons: [
            { text: 'Hide this post' },
            { text: '<strong>Hide all by this user</strong>' },
          ],
          cancelText: 'Cancel',
          buttonClicked: function(index) {
            switch (index) {
              case 0: // hide current post
                streamItems.deletePost(item).then(function() {
                    console.log('Your post has been deleted.');
                  }, function(response) {
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

      $scope.showFilterOptions = function() {
        $ionicActionSheet.show({
          titleText: 'Filter By Type:',
          // buttons: filters,
          buttons: [{
            text: 'All Posts'
          }, {
            text: 'Activity Only'
          }, {
            text: 'My Department'
          }, {
            text: 'My Location'
          }, {
            text: 'All'
          }],
          cancelText: 'Back',
          cancel: function() {
            return true;
          },
          buttonClicked: function(index) {
            $log.debug('actionIndex=', index);
            PostCacheSvc.setCurrentFilter(this.buttons[index].text);
            $scope.filterByType = this.buttons[index].text;
            // TODO: scroll to top.
            return true;
          }
        });
      };

    }
  ]
);
