/**
 * The join service handles calls to the memberbership service
 * from some stream-item/post.
 */
angular.module('sproutApp.services')
  .factory('joinService', ['$log', '$ionicPopup', 'membership', '$ionicBackdrop', 'util',
    function ($log, $ionicPopup, membership, $ionicBackdrop, util) {
      'use strict';

      var onTapGroup = function (groupId) {
        return function (e) {
          return groupId; // return value for popup's promise
        }
      };


      function loadButtons(post) {
        var buttons = [
          {text: 'Cancel', type: 'button-default'}
        ];
        _.forEach(post.viewer.eligibleGroups, function (group) {
          buttons.push({text: group.name, onTap: onTapGroup(group.id), type: 'button-positive'});
        });
        return buttons;
      }

      var service = {};

      service.getJoinIconImage = function (post) {
        return function () {
          return post.viewer.isMember ? 'img/icons/join-confirm-icon.svg' : 'img/icons/join-icon.svg'
        };
      };

      /**
       * If the post has groups associated with it, we show a popup that allow the user to pick a group.
       *
       * @param post
       */
      service.join = function (post) {

        if (post.viewer.eligibleGroups) {

          return $ionicPopup.show({
            title: 'Pick a group',
            buttons: loadButtons(post)
          })
            .then(function (groupId) {
              if (groupId) {
                $log.debug('Picked group #' + groupId);
                return membership.join(post, groupId);
              } else {
                $log.debug('Cancelled group popup');
                return util.q.makeRejectedPromise('canceled');
              }
            });
        } else {
          return membership.join(post);
        }
      };

      return service;
    }
  ]);