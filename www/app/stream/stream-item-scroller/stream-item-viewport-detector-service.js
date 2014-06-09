angular.module('sproutApp.stream-item-scroller.viewport-detector', [
])

// Keeps track of whether stream item batches are visible. 
.factory('streamItemViewportDetector', ['STREAM_VIEW_CONSTANTS',
  function(STREAM_VIEW_CONSTANTS) {
    'use strict';
    var service = {};

    var parent; // the parent of batch elements
    var onHidden; // The handler for items to be hidden.
    var onVisible; // The handler for items to be revealed.
    var currentFirst = -1; // Index of the first visible child.
    var currentLast = -1; // Index of the last visible child.
    var scrollDelegate;

    // Returns scroll position of the scroller.
    function getScrollPosition() {
      return parent.offsetParent.scrollTop + scrollDelegate.getScrollPosition().top;
    }

    /**
     * Initializes the viewport detector.
     *
     * @param  {Function} callback     The handler for hiding an element.
     * @return {undefined}             Nothing is returned.
     */
    service.initialize = function(options) {
      onVisible = options.onVisible;
      onHidden = options.onHidden;
      parent = options.containerElement;
      scrollDelegate = options.scrollDelegate;
    };

    function makeHideQueue() {
      var elements = [];
      var queue = {
        push: function(element) {
          elements.push(element);
        },
        execute: function() {
          setTimeout(function() {
            elements.forEach(function(element) {
              onHidden(element);
            });
          }, 50);
        }
      };
      return queue;
    }

    var previousVisibilityById = {};

    /**
     * Goes through all the items and checks which ones need to be hidden or
     * revealed.
     *
     * @return {undefined}             Nothing is returned.
     */
    service.update = function() {

      if (!parent.offsetParent) {
        return; // The parent is no longer in view.
      }

      var scrollPosition = getScrollPosition();
      var windowTop = scrollPosition - STREAM_VIEW_CONSTANTS.topBuffer;
      var windowBottom = scrollPosition + STREAM_VIEW_CONSTANTS.bottomBuffer;

      var children = Array.prototype.slice.call(parent.children);
      var numChildren = children.length;

      var hideQueue = makeHideQueue(); // A queue for hiding elements.

      var child;
      var childTop;
      var childBottom;

      var wasInView;
      var isInView;
      var childId;

      // For simplicity, let's loop through all the elements.
      for (var i=0; i<numChildren; i++) {
        child = children[i];
        childId = child.getAttribute('id');
        childTop = child.offsetTop;
        childBottom = childTop + child.offsetHeight;

        // Determine if element item is in viewPort.
        isInView = childBottom > windowTop && childTop < windowBottom;
        wasInView = previousVisibilityById[childId] || false;

        // console.log(childTop, childBottom, windowTop, windowBottom, isInView);

        // Did the item's status change?
        if (wasInView && !isInView) {
          // console.log('Pushing a child to hidden:', childId);
          hideQueue.push(child);
          previousVisibilityById[childId] = isInView;
        } else if (isInView && !wasInView) {
          // console.log('Revealing a child:', childId);
          onVisible(child);
          previousVisibilityById[childId] = isInView;
          break;
        }
      }

      hideQueue.execute();
    };

    return service;
  }
]);