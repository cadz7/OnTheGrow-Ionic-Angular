'use strict';

angular.module('sproutApp.controllers')
  .controller('StreamCtrl', ['$scope', 'stream', 'headerRemote', '$ionicActionSheet',
    function($scope, stream, headerRemote, $ionicActionSheet) {

      $scope.stream = stream;
      $scope.header = headerRemote;
      $scope.filterByType = 'ALL';

      // var moreItemsExist = true;

      // $scope.items = [];
      // $scope.createPostVisible = true;

      // AuthSvc.getCurrentUser().then(function(currUser) {
      //   $scope.user = currUser;
      //   $scope.post = Post.createNewPost($scope.user);
      // });

      // PostCacheSvc.registerCurrentPostsChangedHandler(function(streamItems) {
      //   $log.debug('setting items to: ', streamItems);

      //   $scope.items = streamItems;
      //   // Probably should not scroll to top here, because this is called when deleting posts as well.
      // });

      // $scope.submitPost = function() {
      //   $log.debug('StreamsCtrl.submitPost()');
      //   if ($scope.post.$invalid) {
      //     var errMsg = $scope.post.$errors.content.join(' ');
      //     Notify.userError(errMsg);
      //   } else {
      //     Scene.block($scope);
      //     PostCacheSvc.submitPost($scope.post).then(function(post) {
      //       $log.debug('Submitted Post: ', post);
      //       Notify.userSuccess('', 'Post added');
      //       $scope.post = Post.createNewPost($scope.user);
      //       $ionicScrollDelegate.scrollTop();
      //     }, function() {
      //       Notify.apiError(ERRORS.POST_SAVE);
      //     })['finally'](function() {
      //       Scene.ready($scope);
      //     });
      //   }
      // };

      // $scope.deletePost = function(item) {
      //   PostCacheSvc.delete(item).then(function() {
      //     Notify.userSuccess('Your post has been deleted.');
      //   }, function(response) {
      //     if (response.status === 403) {
      //       Notify.userError('You do not have permission to delete this post.');
      //     }
      //   });
      // };


      // var _hideCreatePostModuleListener,
      //   _hideCreatePostModuleFn = function() {
      //     if ($scope.createPostVisible) {
      //       $scope.$apply(function() {
      //         $scope.createPostVisible = false;
      //       });

      //       if (_hideCreatePostModuleListener) {
      //         $ionicGesture.off(_hideCreatePostModuleListener, 'dragstart', _hideCreatePostModuleFn); // remove listener
      //       }
      //     }
      //     return true;
      //   };

      // _hideCreatePostModuleListener = $ionicGesture.on('dragstart', _hideCreatePostModuleFn, $rootElement);

      // $ionicGesture.on('doubletap', function() {
      //   $scope.$apply(function() {
      //     $scope.createPostVisible = true;
      //   });

      //   _hideCreatePostModuleListener = $ionicGesture.on('dragstart', _hideCreatePostModuleFn, $rootElement); // hide on drag
      // }, $rootElement);

      // $scope.getItemWidth = function(item) {
      //   return '100%';
      // };

      // $scope.getItemHeight = function(item) {
      //   return 250;
      // };

      // $scope.moreItemsExist = function() {
      //   return moreItemsExist;
      // };

      // This function should be inside PostCacheSvc.getFilterOptions()
      // success function (See below). But temporarily moving it out to
      // test functionality (with mock data)
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

      // PostCacheSvc.getFilterOptions()
      // 	.then(function(filters) {
      // 		$scope.showFilterOptions = function() {
		    //     $ionicActionSheet.show({
		    //       titleText: 'Filter By Type:',
		    //       buttons: filters,
		    //       cancelText: 'Back',
		    //       cancel: function() {
		    //         return true;
		    //       },
		    //       buttonClicked: function(index) {
		    //         $log.debug('actionIndex=', index);
		    //         PostCacheSvc.setCurrentFilter(this.buttons[index].text);
		    //         $scope.filterByType = this.buttons[index].text;
		    //         // TODO: scroll to top.
		    //         return true;
		    //       }
		    //     });
		    //   };
      // 	});
    }
  ]);