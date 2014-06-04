/**
 * The join service handles calls to the memberbership service
 * from some stream-item/post.
 */
angular.module('sproutApp.services')
  .factory('joinService', ['$log', '$ionicPopup', 'membership', '$ionicBackdrop', 'util', '$rootScope',
    function ($log, $ionicPopup, membership, $ionicBackdrop, util, $rootScope) {
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

        if (post.viewer.eligibleGroups && post.relationTypeSlug === 'challenge') {

          popupScope.post = post;
          popupScope.data = {selectedChallengeOption: null};

          return $ionicPopup.confirm({
            templateUrl: 'app/stream/post/components/join-button/challenge-options.html',
            title: 'Who do you want to represent?',
            scope: popupScope
          })
            .then(function (res) {
              if (res) {
                $log.debug('Picked group #' + popupScope.data.selectedChallengeOption.id);
                return membership.join(post, popupScope.data.selectedChallengeOption.id);
              } else {
                return util.q.makeResolvedPromise('userCanceled'); //not an error
              }
            });
        } else if (post.relationTypeSlug === 'event') {

          var buttons = [
            {text: 'Cancel', type: 'button-default'},
            {text: 'Yes', type: 'button-positive', onTap: function() { return true; }},
            {text: 'No', type: 'button-positive', onTap: function() { return false; }}
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