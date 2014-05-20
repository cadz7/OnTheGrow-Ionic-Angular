angular.module('sproutApp.directives')
.directive('activityList', [function() {
  return {
    scope: true,
    restrict: 'E',
    templateUrl: 'app/stream/add-activity-bar/activity-list.tpl.html',
    link: function(scope, elem, attrs) {
      scope.title = "lol";

      var state = 'categorySelect';

      scope.activityData = scope[attrs.listData];
      scope.nameKey      = attrs.nameKey;

      scope.onItemSelect = function(item) {
        if(state === 'categorySelect') {
          scope.title = item['activityCategoryDisplayName'];
          scope.activityData = item['activities'];
          scope.nameKey = 'activityName';
          state = 'activitySelect';
        } else if(state === 'activitySelect') {
          console.log(item);
        }
      };
    }
  };
}]);
