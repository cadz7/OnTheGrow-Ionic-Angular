angular.module('sproutApp.stream-item-scroller.viewport-detector', [
])

// Keeps track of whether stream item batches are visible. 
.factory('streamItemViewportDetector', ['$window', '$ionicScrollDelegate',
  function($window, $ionicScrollDelegate) {
    var service = {};

    var parent; // the parent of batch elements
    var onHidden; // The handler for items to be hidden.
    var onVisible; // The handler for items to be revealed.
    var currentFirst = -1; // Index of the first visible child.
    var currentLast = -1; // Index of the last visible child.

    // Calculates top position of the element. We'll only be using this for
    // the parent.
    function getTop(element) {
      var top = element.offsetTop;
      while(element.offsetParent) {
        element = element.offsetParent;
        top += element.offsetTop;
      }      
      return top;
    }

    // Get the top of the window.
    function getWindowTop() {
      return $window.pageYOffset + $ionicScrollDelegate.getScrollPosition().top;
    }

    // Sets the handler for hiding elements.
    service.onHidden = function(callback) {
      onHidden = callback;
    };

    // Sets the handler for revealing an element.
    service.onVisible = function(callback) {
      onVisible = callback;
    };

    // Sets the parent element.
    service.setContainerElement = function(newParent) {
      parent = newParent;
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
              console.log('Hiding element', element.getAttribute('id'));
              onHidden(element);
            });
          }, 50);
        }
      };
      return queue;
    }

    // Goes through all the items and checks which ones need to be hidden or
    // revealed.
    service.update = function() {
      var parentTop = getTop(parent);
      var windowTop = getWindowTop();
      var windowBottom = windowTop + 2000; //::todo

      var children = Array.prototype.slice.call(parent.children);
      var numChildren = children.length;

      var hideQueue = makeHideQueue(); // A queue for hiding elements.

      // For simplicity, let's loop through all the elements.
      for (var i=0; i<numChildren; i++) {
        var child = children[i];
        var childTop = parentTop + child.offsetTop;
        var childBottom = childTop + child.offsetHeight;
        // console.log(childBottom, windowTop, i, currentFirst);

        // Should this element be hidden?
        if ((i > currentFirst) && (childBottom < windowTop)) {
          currentFirst = i;
          console.log('Pushing a child to hidden.', child.getAttribute('id'));
          // We've identified an element that can be hidden, but we don't need
          // to do that right away - we'll just schedule it.
          hideQueue.push(child);
        } 

        // Should this element be loaded?
        if ((i > currentLast) && childTop < windowBottom) {
          currentLast = i;
          console.log('Revealing child:', child.getAttribute('id'));
          onVisible(child);
          break;
        }
      }
      hideQueue.execute();
    };

    return service;
  }
]);