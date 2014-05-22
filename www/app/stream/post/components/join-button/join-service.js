/**
 * The join service handles calls to the memberbership service
 * from some stream-item/post.
 */
angular.module('sproutApp.services')
  .factory('joinService', ['$log', '$ionicPopup',
    function ($log, $ionicPopup) {
      'use strict';

      var onTapGroup = function(groupId){
        return function(e){
          return groupId;
        }
      };


      function loadButtons(post){
        var buttons = [];
        _.forEach(post.viewer.eligibleGroups, function (group) {
          buttons.push({text: group.name
            , onTap: onTapGroup(group.id)});
        });

        return buttons;
      }

      var service = {};

      service.getJoinIconImage = function(post){
        return post.viewer.isMember ? 'img/icons/join-confirm-icon.svg' : 'img/icons/join-icon.svg';
      };

      /**
       * If the post has groups associated with it, we show a popup that allow the user to pick a group.
       *
       * @param post
       */
      service.join = function(post){

        if (post.viewer.eligibleGroups){

          $ionicPopup.show({
            title: 'Pick a group',
            buttons: loadButtons(post)
          }).then(function(groupId){
            $log.debug('Picked group #' + groupId);
            // TODO call some join service with groupId and entity id

            // Based off the type of stream, we need to call the right service


          })

        } else {
          // TODO call some join service with groupId and entity id
        }

      };

      return service;
    }
  ]);