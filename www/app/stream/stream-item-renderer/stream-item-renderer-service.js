angular.module('sproutApp.stream-item-renderer', [
  'sproutApp.config'
])
  .factory('streamItemRenderer', ['$q', '$log', '$timeout', '$http', '$interpolate', 'streamItemResourceService', 'streamItemModalService', 'STREAM_CONSTANTS', 'template',
    function ($q, $log, $timeout, $http, $interpolate, streamItemResourceService, streamItemModalService, STREAM_CONSTANTS, template) {
      var service = {};
      var templates = {};
      var templateUrls = {
        joinable: 'app/stream/stream-item-templates/joinable.html'
      };

      var deferredReady = $q.defer();

      service.whenReady = function(){
        return deferredReady.promise;
      };

      window.handleStreamClick = function(id, action) {
        alert(action + ': ' + id);
      };

      function loadTemplate(key) {
        var url = templateUrls[key];
        return $http.get(url)
          .then(function(response) {
            templates[key] = Handlebars.compile(response.data);
            //$interpolate(response.data);
            // console.log(key);
          });
      }

      function init() {
        var templateKeys = _.keys(templateUrls);
        var templatePromises = _.map(templateKeys, loadTemplate);
        return $q.all(templatePromises)
          .then(function() {
            deferredReady.resolve();
          })
          .then(null, $log.error);
      };

      function getHeroImage (item) {
        if (!item.detail) {
          return;
        } else {
          return item.detail.eventImageURL || item.detail.challengeImageURL || item.detail.groupImageURL;
        }
      }

      function isContentOverflowing(item) {
        return item.content.length > STREAM_CONSTANTS.initialPostCharCount;
      }

      function makeJoinable (item, isWrappedInModal) {
        var heroImage = getHeroImage(item);

        var comments = _.map(item.comments, function(comment) {
          return {
            comment: comment,
            displayName: comment.owner.firstNameDisplay,
            dateTimeCreated: comment.dateTimeCreated, // | date : 'MMM d, y h:mm:ss'}},
            parsedContent: template.fill(comment.commentDisplay.template, comment.commentDisplay.values)
          };
        });

        itemType = {
          isGroup: item.streamItemTypeSlug==='group',
          isChallenge: item.streamItemTypeSlug==='challenge',
          isEvent: item.streamItemTypeSlug==='event'
        };

        function makeHandlers() {
          var handlerKeys = [
            'close',
            'toggleMembership',
            'like',
            'showDetails',
            'showEditMenu',
            'postComment',
            'openEventUrl', // openLink(post.detail.eventLocationUrl)
            'openGroupUrl',
            'openChallengeUrl'
          ];
          var handlers = {};

          handlerKeys.forEach(function(key) {
            handlers[key] = 'handleStreamClick(\'' + item.streamItemId +'\', \'' + key +'\')';
          });

          return handlers;
        }

        return templates.joinable({
          item: item,
          itemType: itemType,
          headerIcon: streamItemResourceService.getJoinableHeaderIcon(item),
          displayName: item.owner.firstNameDisplay + ' ' + item.owner.lastNameDisplay,
          timeCreated: '1 am on June 3, 2014', //{{post.dateTimeCreated | date : 'MMM d, h:mma'}}
          details: '',
          heroImage: heroImage,
          hasHeroImage: !!heroImage,
          joinButtonClass1: heroImage? ' join-btn-hero' : ' join-btn',
          joinButtonClass2: (item.viewer.isMember === 1) ? ' sprout-icon-joined' : ' sprout-icon-join',
          likeButtonClass: item.viewer.isLikedByViewer? '' : 'inactive',
          comments: comments.slice(0, 2), // | trimToLatest:numCommentsDisplayed:isWrappedInModal"
          contentIsOverflowing: isContentOverflowing(item) && !isWrappedInModal,
          handlers: makeHandlers(),
          eventDateTime: '6 am on July 18, 2014',
          challengeDeadline: '9 pm on August 8, 2014'
        });
      }

      function renderSync (item) {
        return makeJoinable(item);
      };

      service.render = function (item, delay) {
        return service.whenReady()
          .then(function() {
            return $timeout(function() {
              var html;
              // console.time(item.streamItemId);
              html = renderSync(item);
              // console.timeEnd(item.streamItemId);
              // console.log('html', html);
              return html;
            }, delay);
          });
      }

      init();

      return service;
    }])
