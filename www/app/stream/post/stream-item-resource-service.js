angular.module('sproutApp.services')
  .factory('streamItemResourceService', ['$log', 'template', 'STREAM_CONSTANTS',
    function ($log, template, STREAM_CONSTANTS) {
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
        generic: {template: 'regular/custom.tpl.html', headerIcon: ''},
        post: {template: 'regular/custom.tpl.html', headerIcon: ''},
        add_notification: {template: 'regular/custom.tpl.html', headerIcon: ''},
        activity: {template: 'regular/custom.tpl.html', headerIcon: ''},
        error: {template: 'joinable/error.tpl.html', headerIcon: ''}
      };

      function getResource(streamItem) {
        var slug = streamItem.relationTypeSlug;
        var resource = resourcesForPost[slug];
        if (resource) {
          return resource;
        } else {
          //$log.error('Could not find resource for relationTypeSlug', slug);
          return resourcesForPost['generic'];
        }
      }

      service.getContentUrl = function (streamItem) {
        return templatePath + getResource(streamItem).template;
      };

      service.getJoinableHeaderIcon = function(streamItem){
        return getResource(streamItem).headerIcon;
      };

      service.getContent = function(streamItem, isTruncated){
        var fullContent = template.fill(streamItem.streamItemDisplay.template, streamItem.streamItemDisplay.values);
        var tempContent = fullContent.substr(0, STREAM_CONSTANTS.initialPostCharCount);
        var truncatedContent = (fullContent.charAt(tempContent.length) != ' ') ? tempContent + '...' : tempContent.substr(0, tempContent.lastIndexOf(' ')) + ' ...';
        return isTruncated && (fullContent.length > STREAM_CONSTANTS.initialPostCharCount) ? truncatedContent : fullContent;
      };



      return service;
    }
  ]);