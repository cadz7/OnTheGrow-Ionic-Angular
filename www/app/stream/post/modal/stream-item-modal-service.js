/**
 * Mainly holds a copy of a stream item for the modal that displays the stream item.
 *
 */
angular.module('sproutApp.services')
  .factory('streamItemModalService', ['$log', 'joinableStreamItemService',
    function ($log, joinableStreamItemService) {
      'use strict';

      var service = {modal: null};

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
       * @param streamItem
       * @param viewType
       */
      service.loadStreamItemDetails = function(streamItem, viewType){
        _streamItem = streamItem;
        _viewType = viewType;
        joinableStreamItemService.getDetail(streamItem);
      };

      service.getStreamItem = function(){
        return _streamItem;
      };

      service.getViewType = function(){
        return _viewType;
      };

      service.hideModal = function(){
        if (service.modal){
          service.modal.hide();
        }
      };

      return service;
    }
  ]);