'use strict';

angular.module('sproutApp.stream-item-scroller', [
  'sproutApp.stream-item-scroller.batcher'
])

// Maintains a queue of yet-to-be-displayed batch items.
.factory('streamItemQueue', ['streamItems', 'STREAM_VIEW_CONSTANTS', '$log',
  function(streamItems, STREAM_VIEW_CONSTANTS, $log) {
    var service = {};
    var queue = [];
    var interval;
    var counter = 0;
    var maxCounter = STREAM_VIEW_CONSTANTS.simulatedStreamItemCounterMax;
    var onEndCallback;

    /**
     * Registers the callback to be called when we reach the end of the queue.
     *
     * @param  {Function} callback     The callback function to register.
     * @return {undefined}             Nothing is returned.
     */
    service.onEnd = function(callback) {
      onEndCallback = callback;
    };

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
        if (queue.length < maxLength) {
          $log.debug('Getting more');
          counter ++;
          if (maxCounter && counter > maxCounter) {
            clearInterval(interval);
            onEndCallback();
            return;
          }
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
.factory('streamItemScroller', ['streamItems', 'streamItemBatcher', 'streamItemQueue', '$ionicScrollDelegate', '$log',
  function(streamItems, streamItemBatcher, streamItemQueue, $ionicScrollDelegate, $log) {

    var service = {};

    var subcontainer;
    var bottomPadding;
    var scrollDelegate;

    /**
     * Initializes the scroller service.
     *
     * @param  {Element} containerElement    A DOM element to be used as the
     *                                       container.
     * @return {undefined}                   Nothing is returned.
     */
    service.initialize = function(containerElement) {

      scrollDelegate = $ionicScrollDelegate.$getByHandle('streamScroller');

      // Setup the subcontainer - that's where the stream items are going to go.
      subcontainer = document.createElement('div');
      containerElement.appendChild(subcontainer);

      // Setup the bottom padding bit - this will show a spinner and will
      // later change to a message saying we've got nothing else.
      bottomPadding = document.createElement('div');
      bottomPadding.setAttribute('style', 'text-align:center');
      bottomPadding.innerHTML = '<i style="font-size: 200%; margin-top:50px; margin-bottom: 50px" class="icon ion-ios7-reloading"></i>';
      containerElement.appendChild(bottomPadding);

      // Setup the item batcher.
      streamItemBatcher.initialize({
        scrollDelegate: scrollDelegate,
        containerElement: subcontainer
      });
    };

    /**
     * Starts the scroller.
     *
     * @return {undefined}          Nothing is returned.
     */
    service.run = function() {

      streamItemQueue.start({
        delay: 4000,
        maxLength: 50
      });

      streamItemQueue.onEnd(function() {
        bottomPadding.innerHTML = '<p style="font-size: 200%; margin-top:50px; margin-bottom: 50px">The End</p>';
      });

      setInterval(function loadItemsFromQueue() {
        var items;
        if (streamItemBatcher.isEmpty()) {
          streamItemBatcher.addBatch(streamItemQueue.shift(1));
        } else if (streamItemBatcher.isRunningLow()) {
          streamItemBatcher.addBatch(streamItemQueue.shift(20));
        }
      });
    };

    return service;
  }
]);