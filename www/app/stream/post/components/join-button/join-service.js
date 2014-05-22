/**
 * The join service handles calls to the memberbership service
 * from some stream-item/post.
 */
angular.module('sproutApp.services')
  .factory('joinService', ['$log', '$ionicPopup', 'membership','$ionicBackdrop',
    function ($log, $ionicPopup, membership, $ionicBackdrop) {
      'use strict';

      var onTapGroup = function (groupId) {
        return function (e) {
          return groupId;
        }
      };


      function loadButtons(post) {
        var buttons = [];
        _.forEach(post.viewer.eligibleGroups, function (group) {
          buttons.push({text: group.name, onTap: onTapGroup(group.id)});
        });

        return buttons;
      }

      var service = {};

      service.getJoinIconImage = function (post) {
        return function () {
          return post.viewer.isMember ? 'img/icons/join-confirm-icon.svg' : 'img/icons/join-icon.svg'
        };
      };

      var joinGroupPopup = null;
      service.closePopup = function () {
        if (joinGroupPopup && joinGroupPopup.close) {
          joinGroupPopup.close();
          joinGroupPopup = null;
        }
      };

      /**
       * If the post has groups associated with it, we show a popup that allow the user to pick a group.
       *
       * @param post
       */
      service.join = function (post) {

        if (post.viewer.eligibleGroups) {

          joinGroupPopup = $ionicPopup.show({
            title: 'Pick a group',
            buttons: loadButtons(post)
          })

          var close = joinGroupPopup.close;

          var returnedPromise = joinGroupPopup
            .then(function (groupId) {
              $log.debug('Picked group #' + groupId);
              // TODO Based off the type of stream, we need to call the right service
              return membership.joinChallenge(post.relatedToId, groupId);
            })

          returnedPromise.close = close;

          return returnedPromise;

        } else {
          return membership.joinChallenge(post.relatedToId);
        }

      };

      return service;
    }
  ]);