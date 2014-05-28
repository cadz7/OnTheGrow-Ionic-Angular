angular.module('sproutApp.services')
  .factory('streamItemResourceService', ['$log', 'template',
    function ($log, template) {
      'use strict';

      var service = {};

      var templatePath = 'app/stream/post/';
      var headerIconPath = 'img/icons/';
      var resourcesForPost = {
        //sprout-icon-group
        event: {template: 'joinable/event.tpl.html', headerIcon: 'sprout-icon-event'},
        group: {template: 'joinable/group.tpl.html', headerIcon: 'sprout-icon-group'},
        challenge: {template: 'joinable/challenge.tpl.html', headerIcon: 'sprout-icon-challenge'},
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
        return getResource(streamItem).headerIcon;
      };

      service.getContent = function(streamItem, arg){
        var postContent = template.fill(streamItem.streamItemDisplay.template, streamItem.streamItemDisplay.values);
//        var contentIsOverflowing = postContent.length > STREAM_CONSTANTS.initialPostCharCount;
//
//        var tempContent = postContent.substr(0, STREAM_CONSTANTS.initialPostCharCount);
//        var partialContent = (postContent.charAt(tempContent.length) != ' ') ? tempContent + '...' : tempContent.substr(0, tempContent.lastIndexOf(' ')) + ' ...';

        return postContent;

      };



      return service;
    }
  ]);