angular.module('sproutApp.stream-item-renderer', [
])
  .factory('streamItemRenderer', ['$q', '$log', '$timeout', '$http', '$templateCache', '$interpolate', 'streamItemResourceService', 'streamItemModalService',
    function ($q, $log, $timeout, $http, $templateCache, $interpolate, streamItemResourceService, streamItemModalService) {
      var service = {};

      var deferred = $q.defer();

      service.whenReady = function(){
        return deferred.promise;
      };

      function _loadTemplates(){

        var templateUrls = [
          'app/stream/stream-item/stream-item-templates/joinable/joinable-header.tpl.html',
          'app/stream/stream-item/stream-item-templates/joinable/joinable-content.tpl.html',
          'app/stream/post/joinable/components/detail/challenge-content.html',
          'app/stream/stream-item/stream-item-templates/joinable/joinable-activity-log.tpl.html',
          'app/stream/stream-item/stream-item-templates/common/comments.tpl.html',
          'app/stream/stream-item/stream-item-templates/common/like-comment.tpl.html'
        ];

        var templatePromises = _.map(templateUrls, function(templateUrl) {
          return $http.get(templateUrl)
            .then(function(response) {
              templateName = templateUrl.split('/').pop().split('.')[0];
              console.log(templateName);
              $templateCache.put(templateName, response.data);
            });
        });

        return $q.all(templatePromises)
          .then(null, $log.error);
      };

      _loadTemplates();


      // TODO add a param that indicates content (comment view or detail view)
      function generateJoinableTemplate(res, item) {

        var templates = [
          // 'joinable-activity-log',
          'joinable-header',
          'joinable-content'
        ];

        // if (streamItemModalService.getViewType() === streamItemModalService.COMMENTS_VIEW || 1) {
        //   templates.push('like-comment');
        //   if (item.comments) {
        //     templates.push('comments');
        //   }
        // }

        return _.map(templates, function(templateName) {
          return $templateCache.get(templateName);
        }).join('');
      }

      function renderSync (item) {
        var res = "";
        item.headerIcon = streamItemResourceService.getJoinableHeaderIcon(item);
        item.points = null;
        item.content = streamItemResourceService.getContent(item);

        if (item.streamItemTypeSlug === 'challenge' || 1 ||
          item.streamItemTypeSlug === 'event' ||
          item.streamItemTypeSlug === 'group'){
          res = generateJoinableTemplate(res, item);
        } else if (item.streamItemTypeSlug === 'post'){
          res = $templateCache.get('joinable-header'); // TODO
        } else {
          res = $templateCache.get('joinable-header'); // TODO
        }

        return $interpolate(res)(item);
      };

      service.render = function (item, delay) {
        return $timeout(function() {
          var html;
          // console.time(item.streamItemId);
          html = renderSync(item);
          // console.timeEnd(item.streamItemId);
          // console.log('html', html);
          return html;
        }, delay);
      }

      return service;
    }])
