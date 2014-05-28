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
    .constant('API_CONSTANTS', {
      streamitemTypeId: 9,
      //AUTHENTICATION note: login is preformed by server.login inorder to keep track of the auth token
      logoutEndpoint : 'auth/logout',
      refreshTokenEndpoint : 'auth/refresh_token',
      currentUserEndpoint : 'auth/current_user',

      //ACTIVITIES
      activityLogEndpoint: 'activity_logs',
      activityCategoryEndpoint: 'activity_categories',

      //SCORES
      scoresEndPoint:'scores',

      //STREAM ITEMS
      streamItemsEndPoint : 'stream_items',

      //GROUPS
      groupsEndpoint : 'groups',

      //CHALLENGES
      challengesEndpoint : 'challenges',

      //EVENTS
      eventsEndpoint : 'events'



    })
    .constant('APP_CONFIG', {
      poisonMsgThreshold: 10,
      useMockData :  true,//use hard coded mock data or connect to the actual sprout api?
      errorMsg: {
        SORRY_BUT_YOU_ARE_OFFLINE: 'You are not currently connected to to the internet and cannot perform this action.',
        POST_FAILED_TO_SEND: 'Your post could not be saved due to an error communicating with the sprout server.',
        UNAUTHORIZED: 'You do not have permission to perform this action.'
      },
      debug: true  // enables the developer menu.
    })
;
