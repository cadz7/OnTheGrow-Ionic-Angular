/**
 * The join service handles calls to the memberbership service
 * from some stream-item/post.
 */
angular.module('sproutApp.services')
  .factory('joinService', ['$log', '$ionicPopup', 'membership', '$ionicBackdrop', 'util', '$rootScope',
    function ($log, $ionicPopup, membership, $ionicBackdrop, util, $rootScope) {
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

      var newScope = $rootScope.$new();
      newScope.isChecked = true;
      service.join = function (post) {

        if (post.viewer.eligibleGroups) {

          return $ionicPopup.show({
            template: '<div style="background: yellow"><ion-checkbox ng-model="isChecked">Add to calendar</ion-checkbox></div>',
            title: 'Who do you want to represent?',
            buttons: loadButtons(post),
            scope: newScope
          })
            .then(function (groupId) {
              if (groupId) {
                $log.debug('Picked group #' + groupId);
                return membership.join(post, groupId, {saveToCalendar: newScope.isChecked});
              } else {
                return util.q.makeResolvedPromise('userCanceled'); //not an error
              }
            });
        } else {
          var buttons = [
            {text: 'Cancel', type: 'button-default'},
            {text: 'Yes', type: 'button-positive', onTap: function() { return 1; }},
            {text: 'No', type: 'button-positive', onTap: function() { return 2; }}
          ];
          return $ionicPopup.show({
            title: 'Add to calendar?',
            buttons: buttons
          })
          .then(function (doSave) {
            if (doSave === 1 || doSave === 2) {
              $log.debug('Save to calendar choice:', doSave);
              return membership.join(post, null, {saveToCalendar: doSave});
            } else {
              return util.q.makeResolvedPromise('userCanceled'); //not an error
            }
          });
        }
      };

      return service;
    }
  ]);