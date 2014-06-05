/**
 * The join service handles calls to the memberbership service
 * from some stream-item/post.
 */
angular.module('sproutApp.services')
  .factory('joinService', ['$log', '$ionicPopup', 'membership', '$ionicBackdrop', 'util', '$rootScope', '$q',
    function ($log, $ionicPopup, membership, $ionicBackdrop, util, $rootScope, $q) {
      'use strict';

      var service = {};

      service.getJoinIconImage = function (post) {
        return function () {
          return post.viewer.isMember ? 'img/icons/join-confirm-icon.svg' : 'img/icons/join-icon.svg'
        };
      };

      /**
       * If the post has groups associated with it and is a challenge, we show a popup that allow the user to pick a group.
       * If post is event, then show option to save to calendar.
       *
       * @param post
       */

      var popupScope = $rootScope.$new();



      service.join = function (post) {

        var deferred = $q.defer();

        if (post.viewer.eligibleGroups && post.relationTypeSlug === 'challenge') {

          popupScope.post = post;
          popupScope.data = {selectedChallengeOption: null};
          popupScope.joinChallenge = function(){
            $log.debug('Picked group #' + popupScope.data.selectedChallengeOption.id);
            popup.close();
            membership.join(post, popupScope.data.selectedChallengeOption.id)
              .then(function(){
                deferred.resolve();
              }, $log.error);
          };

          var popup = $ionicPopup.show({
            templateUrl: 'app/stream/post/components/join-button/challenge-options.html',
            title: 'Who do you want to represent?',
            scope: popupScope,
            buttons: [{text: 'Cancel', type: 'button-default'}]
          });

          popup.then(function (res) {
              deferred.resolve('userCanceled');
            }, $log.error);

          return deferred.promise;

        } else if (post.relationTypeSlug === 'event') {

          var buttons = [
            {text: 'Cancel', type: 'button button-full'},
            {text: 'No', type: 'button-default button-full', onTap: function() { return false; }},
            {text: 'Yes', type: 'button-positive button-full', onTap: function() { return true; }}
          ];
          return $ionicPopup.show({
            title: 'Add to calendar?',
            buttons: buttons
          })
            .then(function (doSave) {
              if (doSave === true || doSave === false) {
                $log.debug('Save to calendar choice:', doSave);
                return membership.join(post, null, {saveToCalendar: doSave});
              } else {
                return util.q.makeResolvedPromise('userCanceled'); //not an error
              }
            });
        } else {
          return membership.join(post);
        }
      };

      return service;
    }
  ]);