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
    var counter = 0;
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
          if (counter > 10) {
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
.factory('streamItemScroller', ['streamItems', 'streamItemViewportDetector', 'streamItemBatcher', 'streamItemQueue', '$log',
  function(streamItems, streamItemViewportDetector, streamItemBatcher, streamItemQueue, $log) {
    var service = {};

    var topPadding = document.createElement('div');
    var subcontainer = document.createElement('div');
    var bottomPadding = document.createElement('div');

    /**
     * Initializes the scroller service.
     *
     * @param  {Element} containerElement    A DOM element to be used as the
     *                                       container.
     * @return {undefined}                   Nothing is returned.
     */
    service.init = function(containerElement) {
      topPadding.setAttribute('style', 'text-align:center; height: 200px');
      topPadding.innerHTML = 'Checking for updates.';
      containerElement.appendChild(topPadding);
      containerElement.appendChild(subcontainer);
      bottomPadding.setAttribute('style', 'text-align:center');
      bottomPadding.innerHTML = '<img src="app/stream/spiffygif_30x30.gif">';
      containerElement.appendChild(bottomPadding);

      streamItemViewportDetector.setContainerElement(subcontainer);
      streamItemBatcher.setContainerElement(subcontainer);

      streamItemViewportDetector.onVisible(function(childElement) {
        streamItemBatcher.fleshOutBatch(childElement);
      });

      streamItemViewportDetector.onHidden(function(childElement) {
        streamItemBatcher.stubifyBatch(childElement);
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
        bottomPadding.innerHTML = '<center>The End</center>';
      });
    
      setInterval(function updateBatchVisibility() {
        streamItemViewportDetector.update();
      }, 1000);

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