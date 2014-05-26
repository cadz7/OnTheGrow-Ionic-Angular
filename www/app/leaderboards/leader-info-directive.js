
angular.module('sproutApp.directives')

.directive('leader',['template', 'user', function(template){

    return {
      restrict: 'AE',
      scope: {
        leader: '='
      },
      templateUrl: 'app/leaderboards/leader.tpl.html',
      link: function(scope, element, attrs){

        scope.leader.additionalInfo = template.fill(scope.leader.detailsDisplay.template, scope.leader.detailsDisplay.values);
      }
    }
  }]);