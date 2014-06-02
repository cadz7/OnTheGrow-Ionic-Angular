angular.module('sproutApp.services')
  .factory('renderer', ['template', '$q', '$http', '$templateCache', '$interpolate', 'streamItemResourceService', 'streamItemModalService',
    function (template, $q, $http, $templateCache, $interpolate, streamItemResourceService, streamItemModalService) {
      var service = {};

      var deferred = $q.defer();

      service.whenReady = function(){
        return deferred.promise;
      };

      function _loadTemplates(){

        $http.get('app/stream/stream-item/stream-item-templates/joinable/joinable-header.tpl.html')
          .then(function(html){
            service.html = html.data;
            $templateCache.put('joinable-header', html.data);
            return $http.get('app/stream/stream-item/stream-item-templates/joinable/joinable-content.tpl.html')
          })
          .then(function(html){
            service.html = html.data;
            $templateCache.put('joinable-content', html.data);
            return $http.get('app/stream/post/joinable/components/challege-content.html')

          })
          .then(function(html){
            service.html = html.data;
            $templateCache.put('challenge-content', html.data);
            return $http.get('app/stream/stream-item/stream-item-templates/joinable/joinable-activity-log.tpl.html')

          })
          .then(function(html){
            service.html = html.data;
            $templateCache.put('joinable-activity-log', html.data);
            return $http.get('app/stream/stream-item/stream-item-templates/common/comments.tpl.html')

          })
          .then(function(html){
            service.html = html.data;
            $templateCache.put('comments', html.data);
            return $http.get('app/stream/stream-item/stream-item-templates/common/like-comment.tpl.html')

          })
          .then(function(html){
            service.html = html.data;
            $templateCache.put('like-comment', html.data);
          })
          .then(function(html){
            deferred.resolve();
          })
        ;
      };
      _loadTemplates();


      // TODO add a param that indicates content (comment view or detail view)
      function generateJoinableTemplate(res, item) {
        res += $templateCache.get('joinable-activity-log');
        res += $templateCache.get('joinable-header');
        res += $templateCache.get('joinable-content');

        if (streamItemModalService.getViewType() === streamItemModalService.COMMENTS_VIEW || 1) {
          res += $templateCache.get('like-comment');

          if (item.comments) {
            res += $templateCache.get('comments');
          }
        }
        return res;
      }

      service.render = function (item) {
        var res = "";
        item.headerIcon = streamItemResourceService.getJoinableHeaderIcon(item);
        item.points = null;
        item.content = streamItemResourceService.getContent(item);

        if (item.relationTypeSlug === 'challenge' || 1 ||
          item.relationTypeSlug === 'event' ||
          item.relationTypeSlug === 'group'){
          res = generateJoinableTemplate(res, item);
        } else if (item.relationTypeSlug === 'post'){
          res = $templateCache.get('joinable-header'); // TODO
        } else {
          res = $templateCache.get('joinable-header'); // TODO
        }


        var exp = $interpolate(res);
        return exp(item);
      };


      return service;
    }])
