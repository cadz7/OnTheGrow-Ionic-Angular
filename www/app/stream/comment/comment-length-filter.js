angular.module('sproutApp.comment.trimToLatest', [])
.filter('trimToLatest', 
  [
    function() {
      return function(comments, length, ignore) {
        return ignore ? comments : _.last(comments, length);
      }
    }
  ]
);