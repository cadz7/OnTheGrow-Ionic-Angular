angular.module('sproutApp.directives')
.directive('activityList', [function() {
  return {
    restrict: 'E',
    templateUrl: 'app/stream/add-activity-bar/activity-list.tpl.html',
    link: function(scope, elem, attrs) {
      scope.x = 'y';
      scope.title = "lol";

      scope.items = [1,2,3,4,5,6,7,8,9,10];
    }
  };
}]);
