'use strict';

angular.module('sproutApp.stream-item-scroller', [
  'sproutApp.stream-item-scroller.batcher',
  'sproutApp.stream-item-scroller.viewport-detector'
])

// Maintains a queue of yet-to-be-displayed batch items.
.factory('streamItemQueue', ['streamItems', '$log',
  function(streamItems, $log) {
    var service = {};
    var queue = [];
    var interval;

    /**
     * Starts the queue.
     *
     * @param  {object} params        Configurations for the queue.
     * @return {[type]}        [description]
     */
    service.start = function(params) {
      params = params || {};
      var maxLength = params.maxLength || 100;
      interval = setInterval(function() {

        $log.debug('in queue:', queue.length, maxLength);

        if (queue.length < maxLength) {
          $log.debug('Getting more');
          streamItems.getEarlier()
            .then(function(items) {
              Array.prototype.push.apply(queue, items);
            })
            .then(null, $log.error);
        }
      }, params.delay || 200);
    };

    /**
     * Returns a requested number of items from the head of the queue.
     *
     * @param  {number} count           The number of items to shift.
     * @return {array}                  An array of items.
     */
    service.shift = function(count) {
      var shifted = queue.slice(0, count);
      queue = queue.slice(count);
      return shifted;
    };

    return service;
  }
])

// Puts together the scroller functionality.
.factory('streamItemScroller', ['streamItems', 'streamItemViewportDetector', 'streamItemPaginator', 'streamItemQueue', '$log',
  function(streamItems, streamItemViewportDetector, streamItemPaginator, streamItemQueue, $log) {
    var service = {};
    service.init = function(containerElement) {
      streamItemViewportDetector.setContainerElement(containerElement);
      streamItemPaginator.setContainerElement(containerElement);

      streamItemViewportDetector.onVisible(function(childElement) {
        streamItemPaginator.fleshOutBatch(childElement);
      });

      streamItemViewportDetector.onHidden(function(childElement) {
        streamItemPaginator.stubifyBatch(childElement);
      });

    };

    service.run = function() {

      streamItemQueue.start({
        delay: 1000,
        maxLength: 50
      });
    
      setInterval(function updateBatchVisibility() {
        streamItemViewportDetector.update();
      }, 1000);

      setInterval(function loadItemsFromQueue() {
        var items;
        if (streamItemPaginator.isRunningLow()) {
          streamItemPaginator.addBatch(streamItemQueue.shift(20));
        }
      });
    };

    return service;
  }
]);