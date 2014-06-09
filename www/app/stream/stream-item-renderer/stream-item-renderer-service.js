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

      // A deferred to keep track of whether we've loaded all the templates.
      var deferredReady = $q.defer();

      /**
       * Returns a promise that resolves when the service is ready to be used.
       *
       * @return {promise}              A $q promise that resolves when the
       *                                service is ready to be used.
       */
      service.whenReady = function(){
        return deferredReady.promise;
      };


      // Loads and compiles a template.
      function loadTemplate(key) {
        var url = templateUrls[key];
        return $http.get(url)
          .then(function(response) {
            templates[key] = Handlebars.compile(response.data);
          });
      }

      // Initializes the service.
      function init() {
        var templateKeys = _.keys(templateUrls);
        var templatePromises = _.map(templateKeys, loadTemplate);
        return $q.all(templatePromises)
          .then(function() {
            deferredReady.resolve();
          })
          .then(null, $log.error);
      };

      // Gets hero image.
      function getHeroImage (item) {
        if (!item.detail) {
          return;
        } else {
          return item.detail.eventImageURL || item.detail.challengeImageURL || item.detail.groupImageURL;
        }
      }

      function prefetchImage(imageUrl) {
        var element = document.createElement('img');
        element.setAttribute('src', imageUrl);
      }

      // Checks if the content is overflowing.
      function isContentOverflowing(item) {
        return item.content && item.content.length > STREAM_CONSTANTS.initialPostCharCount;
      }

      // Makes a string representation of a handler function call. This is
      // going to be a _STRING_ that we'll paste into the template. This
      // function does not specify any arguments because we'll be pulling
      // them in via "arguments."
      function makeHandlerString() {
        var functionName = 'window.handleSproutStreamScrollerClick';
        var singleQuote = '\''; // Keeps JSHint happy.
        var doubleQuote = '"';
        var quotedArguments = _.map(arguments, function(arg) {
          arg = '' + arg;
          if (arg.search(singleQuote) >= 0 || arg.search(doubleQuote) >= 0) {
            throw new Error('Do not use quotes in handler string arguments');
          }
          return singleQuote + arg + singleQuote;
        });
        var stringFunction = functionName + '(' + quotedArguments.join(', ') + ')';
        return stringFunction;
      }

      function formatDateTime(isoDateTime) {
        return moment(isoDateTime).format('MMM D, h:mm:ss a');
      }
      function formatDate(isoDateTime) {
        return moment(isoDateTime).format('MMM D');
      }

      // Generates HTML for a joinable item.
      function makeJoinable (item, isWrappedInModal) {
        var heroImage = getHeroImage(item);
        var handlerKeys = [
          'close',
          'toggleMembership',
          'like',
          'showDetails',
          'showComments',
          'showEditMenu',
          'postComment',
          'openEventUrl', // openLink(post.detail.eventLocationUrl)
          'openGroupUrl',
          'openChallengeUrl'
        ];
        var handlers = {};
        var commentHandlerKeys = ['postComment'];

        if (heroImage) {
          prefetchImage(heroImage);
          prefetchImage(item.avatarURL);
        }

        var comments = _.map(item.comments, function(comment) {

          var commentHandlers = {};

          commentHandlerKeys.forEach(function(key) {
            commentHandlers[key] = makeHandlerString(key, item.streamItemId, comment.commentId);
          });
          return {
            comment: comment,
            displayName: comment.owner.firstNameDisplay || comment.owner.firstName + ' ' + comment.owner.lastName,
            dateTimeCreated: formatDateTime(comment.dateTimeCreated),
            parsedContent: template.fill(comment.commentDisplay.template, comment.commentDisplay.values),
            commentHandlers: commentHandlers
          };
        });

        itemType = {
          isGeneric: item.relationTypeSlug!=='group' && item.relationTypeSlug!=='challenge' && item.relationTypeSlug!=='event',
          isGroup: item.relationTypeSlug==='group',
          isChallenge: item.relationTypeSlug==='challenge',
          isEvent: item.relationTypeSlug==='event',
          isJoinable: item.relationTypeSlug==='group' || item.relationTypeSlug==='challenge' || item.relationTypeSlug==='event'
        };

        var mode = streamItemModalService.isModalActive() ? 'modal' : 'stream';

          handlerKeys.forEach(function(key) {
          handlers[key] = makeHandlerString(key, item.streamItemId, 'text_stream_item_' + item.streamItemId + '_' + mode);
        });

        //debugger;
        return templates.joinable({
          isWrappedInModal: streamItemModalService.isModalActive(),
          mode: mode,
          isCommentsView: streamItemModalService.isCommentsView() || !streamItemModalService.isModalActive(),
          isDetailsView: streamItemModalService.isDetailsView() && streamItemModalService.isModalActive,
          item: item,
          itemType: itemType,
          headerIcon: streamItemResourceService.getJoinableHeaderIcon(item),

          displayName: item.owner.firstNameDisplay + ' ' + item.owner.lastName,
          timeCreated: formatDateTime(item.dateTimeCreated),
          details: '',
          heroImage: heroImage,
          hasHeroImage: !!heroImage,
          hasNotHeroImage: !heroImage,
          hasDetails: !!item.relatedItemDetails,
          joinButtonClass1: heroImage? ' join-btn-hero' : ' join-btn',
          joinButtonClass2: (item.viewer.isMember === 1) ? ' sprout-icon-joined' : ' sprout-icon-join',
          likeButtonClass: item.viewer.isLikedByViewer? '' : 'inactive',
          comments: streamItemModalService.showAllComments ? comments : comments.slice(-STREAM_CONSTANTS.initialCommentCountShown), // | trimToLatest:numCommentsDisplayed:isWrappedInModal"
          hasMoreComments: comments.length > STREAM_CONSTANTS.initialCommentCountShown, // | trimToLatest:numCommentsDisplayed:isWrappedInModal"
          numCommentsRemainingMsg: streamItemModalService.getNumCommentsRemainingMsg(),
          contentIsOverflowing: isContentOverflowing(item) && !isWrappedInModal,
          handlers: handlers,
          eventDateTime: formatDateTime(item.relatedItemDetails.eventDateTime),
          challengeDeadline: formatDate(item.relatedItemDetails.challengeDeadline)
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
