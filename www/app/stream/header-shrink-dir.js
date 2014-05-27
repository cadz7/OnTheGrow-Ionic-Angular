'use strict';
 
angular.module('sproutApp.directives')
  .directive('headerShrink', ['$document', '$ionicScrollDelegate',
    function($document, $ionicScrollDelegate) {
      
      var shrink = function(header, content, amt, max) {
        ionic.requestAnimationFrame(function() {
          console.log(amt);
          header.style[ionic.CSS.TRANSFORM] = 'translate3d(0,-' + amt + 'px, 0)';
        });
      };

      return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
          var starty = $scope.$eval($attr.headerShrink) || 0;
          var shrinkAmt;
          
          var header = $document[0].body.querySelector('#stream-header');
          var headerHeight = 0;

          for(var i = 0; i < header.children.length; i++) {
            headerHeight += header.children[i].offsetHeight;
          }

          var headerPos = 0;
          function moveHeader(y) {
            headerPos = y;
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + headerPos + 'px, 0)';
          }

          // Push the stream down below the post box
          $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + headerHeight + 'px, 0)';

          var prev = 0,
              delta = 0,
              dir = 1,
              prevDir = 1,
              prevShrinkAmt = 0;

          var contentShift;

          $element.bind('scroll', function(e) {
            delta = e.detail.scrollTop - prev;
            dir = delta >= 0 ? 1 : -1;
            // Capture change of direction
            if(dir !== prevDir) {
              starty = e.detail.scrollTop;
            }

            var scroll = e.detail.scrollTop;

            // If scrolling down
            if(dir === 1) {
              contentShift = headerHeight - e.detail.scrollTop;

              if(contentShift >= 0) {
                $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + contentShift + 'px, 0)';
              }

              if(headerPos * -1 <= headerHeight && scroll >= 0) {
                console.log(headerPos, headerHeight);
                moveHeader(headerPos - delta);
              }

            }

            // If scrolling up (pulling down)
            else {
              if(headerPos < 0) {
                moveHeader(headerPos - delta);
              }
            }

            prevDir = dir;
            prev = e.detail.scrollTop;
          });
        }
      };

    }]);
