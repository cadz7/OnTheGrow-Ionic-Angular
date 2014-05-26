'use strict';

angular.module('sproutApp.controllers')
.controller(
  'StreamCtrl',
  [
    '$scope', 'streamItems', '$ionicModal', 'headerRemote', '$ionicActionSheet', '$log', 'streamItemModalService',
    function($scope, streamItems, $ionicModal, headerRemote, $ionicActionSheet, $log, streamItemModalService) {
    	$scope.stream = streamItems;

    	$scope.header = headerRemote;
    	$scope.filterByType = 'ALL';

    	$scope.closeFullPost = function() {
        $scope.streamItemModal.hide();
    	};

    	$scope.closeModal = function() {
    		$scope.streamItemModal.hide();
    	};

      $scope.performInfiniteScroll = _.throttle(function() {
        $scope.$evalAsync(function() {
          streamItems.getEarlier().then(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        });
      }, 250);

      // We do this, it seems, to provide close methods....
      var editStreamItemModalScope = $scope.$new(),
          streamItemModalScope = $scope.$new();

      $ionicModal.fromTemplateUrl('app/stream/post/modal/edit-post-modal.tpl.html', {
        scope: editStreamItemModalScope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.editStreamItemModal = modal;
      });

      $ionicModal.fromTemplateUrl('app/stream/post/modal/full-post-modal.tpl.html', {
        scope: streamItemModalScope,
        animation: 'slide-in-up',
        backdropClickToClose: false
      }).then(function(modal) {
        $scope.streamItemModal = modal;
        streamItemModalScope.streamItemModalService = streamItemModalService;
      });

      $scope.$on('$destroy', function() {
        $scope.editStreamItemModal.remove();
        $scope.streamItemModal.remove();
      });

      $scope.newPost = {
        text: ''
      };

      $scope.submitPost = function(post) {
        streamItems.postItem(post)
          .then(function() {
            console.log('Your post has been created.');
            $scope.newPost.text = '';
          }, function(response) {
            if (response.status === 403) {
              console.error('You do not have permission to create this post.');
            } else {
              throw response;
            }
          }
        )
        .then(null, $log.error);
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


      //
      // REFRESH STREAM ITEMS HERE
      //
      $scope.onRefreshPullDown = function() {
      
        // Call this when done
        $scope.$broadcast('scroll.refreshComplete');        
      };

    }
  ]
);
