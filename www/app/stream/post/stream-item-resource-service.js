angular.module('sproutApp.services')

// Generic util methods.

  .factory('streamItemResourceService', ['$log',
    function ($log) {
      'use strict';

      var service = {};

      var templatePath = 'app/stream/post/';
      var headerIconPath = 'img/icons/';
      var resourcesForPost = {
        event: {template: 'joinable/event.tpl.html', headerIcon: 'event-icon.svg'},
        group: {template: 'joinable/group.tpl.html', headerIcon: 'group-icon.svg'},
        challenge: {template: 'joinable/challenge.tpl.html', headerIcon: 'challenge-icon.svg'},
        custom: {template: 'regular/custom.tpl.html', headerIcon: ''},
        post: {template: 'regular/custom.tpl.html', headerIcon: ''},
        add_notification: {template: 'regular/custom.tpl.html', headerIcon: ''},
        activity: {template: 'regular/custom.tpl.html', headerIcon: ''},
        error: {template: 'components/error.tpl.html', headerIcon: ''}
      };

      function getResource(streamItem) {
        var slug = streamItem.streamItemTypeSlug;
        var resource = resourcesForPost[slug];
        if (resource) {
          return resource;
        } else {
          $log.error('Could not find resource for streamItemTypeSlug', slug);
          return resourcesForPost['error'];
        }
      }

      service.getContentUrl = function (streamItem) {
        return templatePath + getResource(streamItem).template;
      };

      service.getJoinableHeaderIcon = function(streamItem){
        return headerIconPath + getResource(streamItem).headerIcon;
      };

      return service;
    }
  ]);