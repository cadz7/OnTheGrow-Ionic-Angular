// TODO: replace with either decorator or http://tympanus.net/Development/FullscreenOverlayStyles/index3.html
angular.module('sproutApp.ionic.extend.ion-action-sheet-from-top', [])
.directive('ionActionSheetFromTop', ['$document', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element){
      var keyUp = function(e) {
        if(e.which == 27) {
          $scope.cancel();
          $scope.$apply();
        }
      };

      var backdropClick = function(e) {
        if(e.target == $element[0]) {
          $scope.cancel();
          $scope.$apply();
        }
      };
      $scope.$on('$destroy', function() {
        $element.remove();
        $document.unbind('keyup', keyUp);
      });

      $document.bind('keyup', keyUp);
      $element.bind('click', backdropClick);
    },
    template: '<div class="action-sheet-backdrop action-sheet-backdrop-from-top">' +
                '<div class="action-sheet-wrapper action-sheet-wrapper-top">' +
                  '<div class="action-sheet">' +
                    '<div class="action-sheet-group">' +
                      '<div class="action-sheet-title" ng-if="titleText" ng-bind-html="titleText"></div>' +
                      '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons" ng-bind-html="button.text"></button>' +
                    '</div>' +
                    '<div class="action-sheet-group" ng-if="destructiveText">' +
                      '<button class="button destructive" ng-click="destructiveButtonClicked()" ng-bind-html="destructiveText"></button>' +
                    '</div>' +
                    '<div class="action-sheet-group" ng-if="cancelText">' +
                      '<button class="button" ng-click="cancel()" ng-bind-html="cancelText"></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
}]).factory('$ionicActionSheetFromTop', [
  '$rootScope',
  '$document',
  '$compile',
  '$animate',
  '$timeout',
  '$ionicTemplateLoader',
  '$ionicPlatform',
function($rootScope, $document, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform) {

  return {
    /**
     * @ngdoc method
     * @name $ionicActionSheet#show
     * @description
     * Load and return a new action sheet.
     *
     * A new isolated scope will be created for the
     * action sheet and the new element will be appended into the body.
     *
     * @param {object} opts The options for this ActionSheet. Properties:
     *
     *  - `[Object]` `buttons` Which buttons to show.  Each button is an object with a `text` field.
     *  - `{string}` `titleText` The title to show on the action sheet.
     *  - `{string=}` `cancelText` The text for a 'cancel' button on the action sheet.
     *  - `{string=}` `destructiveText` The text for a 'danger' on the action sheet.
     *  - `{function=}` `cancel` Called if the cancel button is pressed or the backdrop is tapped.
     *  - `{function=}` `buttonClicked` Called when one of the non-destructive buttons is clicked,
     *     with the index of the button that was clicked and the button object. Return true to close
     *     the action sheet, or false to keep it opened.
     *  - `{function=}` `destructiveButtonClicked` Called when the destructive button is clicked.
     *     Return true to close the action sheet, or false to keep it opened.
     */
    show: function(opts) {
      var scope = $rootScope.$new(true);
      var PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET = 300;

      angular.extend(scope, {
        cancel: angular.noop,
        buttonClicked: angular.noop,
        destructiveButtonClicked: angular.noop,
        buttons: []
      }, opts);

      // Compile the template
      var element = $compile('<ion-action-sheet-from-top buttons="buttons"></ion-action-sheet>')(scope);

      // Grab the sheet element for animation
      var sheetEl = angular.element(element[0].querySelector('.action-sheet-wrapper'));

      var hideSheet = function(didCancel) {
        sheetEl.removeClass('action-sheet-up');
        if(didCancel) {
          $timeout(function(){
            opts.cancel();
          }, 200);
        }

        $animate.removeClass(element, 'active', function() {
          scope.$destroy();
        });

        $document[0].body.classList.remove('action-sheet-open');

        scope.$deregisterBackButton && scope.$deregisterBackButton();
      };

      // Support Android back button to close
      scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(
        function(){
          hideSheet();
        },
        PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET
      );

      scope.cancel = function() {
        hideSheet(true);
      };

      scope.buttonClicked = function(index) {
        // Check if the button click event returned true, which means
        // we can close the action sheet
        if((opts.buttonClicked && opts.buttonClicked(index, opts.buttons[index])) === true) {
          hideSheet(false);
        }
      };

      scope.destructiveButtonClicked = function() {
        // Check if the destructive button click event returned true, which means
        // we can close the action sheet
        if((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
          hideSheet(false);
        }
      };

      $document[0].body.appendChild(element[0]);

      $document[0].body.classList.add('action-sheet-open');

      var sheet = new ionic.views.ActionSheet({el: element[0] });
      scope.sheet = sheet;

      $animate.addClass(element, 'active');

      $timeout(function(){
        sheetEl.addClass('action-sheet-up');
      }, 20);

      return sheet;
    }
  };

}]);