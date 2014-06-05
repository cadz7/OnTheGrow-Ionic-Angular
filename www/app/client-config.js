/**
 * Created by justin on 2014-05-27.
 */


angular.module('sproutApp.config', [])
    .constant('API_URL','https://platform.dev.sproutatwork.com/v1/')
    .constant('STREAM_CONSTANTS', {
      defaultMaxItemCount: 10 , //default number of stream items to get in a single req
      initialCommentCountShown: 3,
      initialPostCharCount: 70
    })
    .constant('METRICS_CONSTANTS',{
      defaultMaxItemCount : 10  //default number of activity logs to get in a single req
    })
    .constant('API_CONSTANTS', {
      streamitemTypeId: 9,
      //AUTHENTICATION note: login is preformed by server.login inorder to keep track of the auth token
      logoutEndpoint : 'auth/logout',
      refreshTokenEndpoint : 'auth/refresh_token',
      currentUserEndpoint : 'auth/current_user',

      //ACTIVITIES
      activityLogEndpoint: 'activity_logs',
      activityCategoryEndpoint: 'activity_categories',
      sugestedActivitiesEndpoint : 'suggested_activities',

      //FILTERS
      filtersEndpoint : 'filters',

      //LEADERBOARDS
      leaderboardsEndpoint : 'leaderboards',

      //SCORES
      scoresEndPoint:'scores',

      //STREAM ITEMS
      streamItemsEndPoint : 'stream_items',

      //GROUPS
      groupsEndpoint : 'groups',

      //CHALLENGES
      challengesEndpoint : 'challenges',

      //EVENTS
      eventsEndpoint : 'events',

      //MEMBERSHIP
      membershipEndpoint : 'memberships',
      eventsMembershipEndpoint : 'memberships/events',
      groupsMembershipEndpoint : 'memberships/groups',
      challengesMembershipEndpoint : 'memberships/challenges'

    })
    .constant('APP_CONFIG', {
      poisonMsgThreshold: 10,
      useMockData :  true,//use hard coded mock data or connect to the actual sprout api?
      useSimonsCredentials :  false,//use hard coded mock data or connect to the actual sprout api?
      errorMsg: {
        SORRY_BUT_YOU_ARE_OFFLINE: 'You are not currently connected to to the internet and cannot perform this action.',
        POST_FAILED_TO_SEND: 'Your post could not be saved due to an error communicating with the sprout server.',
        UNAUTHORIZED: 'You do not have permission to perform this action.'
      },
      debug: true,  // enables the developer menu.
      maxLogSize: 120, // when this size is reached, 50 msgs are deleted.  don't make this less than 75.
      streamCache: {
        maxStreamItems: 800,  // this is the maximum amount of stream items that the MOST frequently accessed filter would contain.
        minStreamItems: 200,  // this is the maximum amount of stream items that the LEAST Frequently accessed filters would contain.
        quotaBufferSize: 40,  // this is the amount of stream items that would need to get added to the bin before it would cause another quotaMaxSizeExceeded situation and trim the excess steam items.
        lessFrequentlyAccessedFilterQuotaReducer: 100 // each filter that is accessed less frequently then others would hold this amount less than the filter that is accessed more frequently than it.
      }
    });
;
