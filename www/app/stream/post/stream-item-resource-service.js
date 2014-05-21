angular.module('sproutApp.services')

// Generic util methods.

  .factory('streamItemResourceService', ['$log',
    function ($log) {
      'use strict';

      var service = {};

      // TODO put into custom templateGeneratorService
      var templatePath = 'app/stream/post/';
      var headerIconPath = 'img/icons/';
      var resourcesForPost = {
        event: {template: 'joinable/event.tpl.html', headerIcon: 'event-icon.svg'},
        group: {template: 'joinable/group.tpl.html', headerIcon: 'group-icon.svg'},
        challenge: {template: 'joinable/challenge.tpl.html', headerIcon: 'challenge-icon.svg'},
        custom: {template: 'regular/custom.tpl.html', headerIcon: ''},
        add_notification: {template: 'regular/custom.tpl.html', headerIcon: ''},
        activity: {template: 'regular/custom.tpl.html', headerIcon: ''},
        error: {template: 'components/error.tpl.html', headerIcon: ''}
      };

      service.getContentUrl = function (streamItem) {
        return templatePath + (resourcesForPost[streamItem.streamItemTypeSlug] || resourcesForPost['error']).template;
      };

      service.getJoinableHeaderIcon = function(streamItem){
        return headerIconPath + (resourcesForPost[streamItem.streamItemTypeSlug]|| resourcesForPost['error']).headerIcon ;
      }

      return service;
    }
  ]);