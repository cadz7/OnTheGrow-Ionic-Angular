/**
 * Created by justin on 2014-06-02.
 */


angular.module('sproutApp')

.directive('expandInput', ['$log', '$compile', function($log, $compile) {
  var shrunkInput = '<input type="text" maxlength="@maxLength" ng-model="ngModel"\
        placeholder="@placeholder" ng-enter="ngEnter()" class="@class"\
        placeholder="@placeholder" ng-enter="ngEnter()" class="@class" show-keyboard="focus"\
        ng-focus="expandInput()" />';
  return {
    restrict: 'E',
    template: function(tElem, attrs) {
      shrunkInput = shrunkInput.replace('@placeholder', attrs.placeholder || '');
      shrunkInput = shrunkInput.replace('@maxLength', attrs['maxLength'] || 300);
      shrunkInput = shrunkInput.replace('@class', attrs['inputClass'] || '');
      return shrunkInput;
    },
    scope: {
      placeholder: '@placeholder',
      ngEnter: '&ngEnter',
      ngModel: '=ngModel',
      maxLength: '@maxLength'
    },
    link: function(scope, elem, attrs) {
      $log.debug('expandInput.link()', attrs);
      scope.expandInput = function() {
        var html = '<textarea ng-model="ngModel" class="post-box" style="height:100%; width:100%; overflow:auto" ng-blur="shrinkInput()"></textarea>';
        var textarea = $compile(html)(scope);
        elem.html('').append(textarea);
        textarea[0].focus();
      };

      scope.shrinkInput = function() {
        $log.debug('shrinking...');
        var shrunk = $compile(shrunkInput)(scope);
        elem.html('').append(shrunk);
      };
    }
  };
}])
;