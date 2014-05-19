
angular.module('sproutApp.directives')

.directive('leader',['template', function(template){

    return {
      restrict: 'AE',
      scope: {
        leader: '='
      },
      templateUrl: 'app/leaderboards/leader.tpl.html',
      link: function(scope, element, attrs){

      }
    }
  }]);