/**
 * Mainly holds a copy of a stream item for the modal that displays the stream item.
 *
 */
angular.module('sproutApp.services')
  .factory('streamItemModalService', ['$log',
    function ($log) {
      'use strict';

      var service = {};

      service.DETAILED_VIEW = 'DETAIL';
      service.COMMENTS_VIEW = 'COMMENTS';


      var _streamItem = null;
      var _viewType = null;

      /**
       *
       * Sets the stream item used by the stream item modal.
       *
       * If the user clicks the comment on the stream item (from stream view), we remain of the comments
       * view. If the user clicks anywhere else, we should see a detail view of the stream.
       *
       * The post directive reacts correspondingly based on the .type attribute for streamItem.
       *
       * TODO should fetch from the server a detail version of streamItem if viewing the detail
       *
       *
       * @param streamItem
       * @param viewType
       */
      service.setStreamItem = function(streamItem, viewType){
//        _streamItem = angular.copy(streamItem);

        _streamItem = streamItem;
        _streamItem.type = viewType;
        _viewType = viewType;
      };

      service.getStreamItem = function(){
        return _streamItem;
      };

      service.getViewType = function(){
        return _viewType;
      };

      return service;
    }
  ]);