'use strict';



angular.module('sproutApp.directives')
  .directive('headerShrink', ['$document', '$ionicScrollDelegate',
    function($document, $ionicScrollDelegate) {
      

      return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
          
          var header = $document[0].body.querySelector('#stream-header');
          var headerHeight = 0;
          for(var i = 0; i < header.children.length; i++) {
            headerHeight += header.children[i].offsetHeight;
          }
          
          if(ionic.Platform.platform() === 'ios') {
            var postBar = $document[0].body.querySelector('.create-post');
            postBar.style.top = '64px';
          }

          var headerPos = 0;
          function moveHeader(y) {
            headerPos = y;
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + headerPos + 'px, 0)';
          }

          // Push the stream down below the post box
          $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + (headerHeight - 5) + 'px, 0)';

          var prev = 0,
              delta = 0,
              dir = 1,
              prevDir = 1,
              prevShrinkAmt = 0;

          var contentShift;

          $element.bind('scroll', function(e) {
            var amt = 0;
            var streamAmt = 0;

            delta = e.detail.scrollTop - prev;
            dir = delta >= 0 ? 1 : -1;

            if(dir === 1) {
              // Start shrinking
              if(e.detail.scrollTop >= 0) {
                amt = Math.max(-headerHeight, Math.min(0, headerPos - delta));
                moveHeader(amt);
              }

              contentShift = headerHeight - Math.min(headerHeight, e.detail.scrollTop) - 5;
              $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0,' + contentShift + 'px, 0)';
              
            } else {
              amt = Math.min(0, headerPos - delta);
              moveHeader(amt);
            }


            prevDir = dir;
            prev = e.detail.scrollTop;
          });
        }
      };

    }]);
