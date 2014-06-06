/**
 * Mainly holds a copy of a stream item for the modal that displays the stream item.
 * Keeps track of state of the modal.
 *
 * The modal can be showing a 'detail view' of the stream item or a 'comments view' of the stream item.
 * It also knows if the modal is active or not.
 *
 */
angular.module('sproutApp.services')
  .factory('streamItemModalService', ['$log', 'joinableStreamItemService', 'STREAM_CONSTANTS', '$ionicScrollDelegate',
    function ($log, joinableStreamItemService, STREAM_CONSTANTS, $ionicScrollDelegate) {
      'use strict';


      var service = {modal: null,
        commentLimit: -STREAM_CONSTANTS.initialCommentCountShown
      };


      service.DETAILED_VIEW = 'DETAIL';
      service.COMMENTS_VIEW = 'COMMENTS';


      var _streamItem = null;
      var _viewType = null;
      var _modalActive = null;

      service.increaseCommentLimit = function(){
        service.commentLimit-= STREAM_CONSTANTS.initialCommentCountShown;
      };
      service.resetCommentLimit = function() {
        service.commentLimit = -STREAM_CONSTANTS.initialCommentCountShown;
        $ionicScrollDelegate.$getByHandle('streamItemModal').scrollTop(false);
      };
      service.getNumCommentsRemainingMsg = function(){
        var res = '';
        var remaining = _streamItem.comments.length - Math.abs(service.commentLimit);
        if (remaining == 1){
          res = '1 more comment';
        } else if (remaining > 1){
          res = remaining + ' more comments';
        }
        return res;
      };

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
        _modalActive = true;
        joinableStreamItemService.getDetail(streamItem);
      };

      service.cleanUp = function(){
        _modalActive = false;
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

      service.isModalActive = function(){
        return _modalActive;
      };

      service.isCommentsView = function(){
        return _viewType === service.COMMENTS_VIEW;
      };

      service.isDetailsView = function(){
        return _viewType === service.DETAILED_VIEW;
      };

      return service;
    }
  ]);