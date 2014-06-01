/* global chai */

angular.module('sproutApp.data.activities', [
  'sproutApp.config',
  'sproutApp.user',
  'sproutApp.util',
  'sproutApp.cache',
  'sproutApp.server-post-queue',
  'sproutApp.server'
])

.factory('activities', ['$q', 'user', 'util', 'cache', 'serverPostQueue', 'mockActivitiesServer', 'API_CONSTANTS','APP_CONFIG',
  function ($q, user, util, cache, serverPostQueue, server, API, APP_CONFIG) {
    'use strict';
    var service = {
      categories : [], // an array of currently loaded items
      activityLog : []
    };   
    
        /*
    * Loads a collection of logged activities for the current user
    *
    * @param {int,required} timePeriodId   Provides the time period  Id for which the activity log should be generated //NOTE: GET FILTERS returns the id as a string -> ????
    * @param {int} idGreaterThan            An optional parameter to specify the last Id of the activity log for the user shown and get the next items (needed in case customer selected to see log for the year and there were thousands of items)
    *
    * @returns {promise}                    a promise containing an array of all activities by the user for the requested timeperiod
    */
    service.loadActivityCategories = function() {
      return server.get(API.activityCategoryEndpoint).then(function(categories) {
        service.categories = categories;
        cache.set('activity_categories', categories);
      }, function error(e) {
        service.categories = cache.get('activity_categories');
        throw e;
      });     
    };

    /*
    * Loads a collection of logged activities for the current user
    *
    * @param {int,required} timePeriodId   Provides the time period  Id for which the activity log should be generated //NOTE: GET FILTERS returns the id as a string -> ????
    * @param {int} idGreaterThan            An optional parameter to specify the last Id of the activity log for the user shown and get the next items (needed in case customer selected to see log for the year and there were thousands of items)
    *
    * @returns {promise}                    a promise containing an array of all activities by the user for the requested timeperiod
    */
    service.loadActivityLog = function(timePeriodId, idGreaterThan) {
      return server.get(API.activityLogEndpoint,{timePeriodId:timePeriodId,idGreaterThan:idGreaterThan})
        .then(function(activityLog) {
          cache.set('activity_log', activityLog);
          service.activityLog = activityLog;
          return activityLog;
        }, function error(response) {
          if (response==='offline') {
            service.activityLog = cache.get('activity_log');
            if (!service.activityLog) {
              service.activityLog = [];
            }
            return null;
          }
          throw response;
        });      
    };

    /**
     * Logs user's activities.
     *
     * @param  {Array} loggedActivities  An array of activities to be logged.
     * @return {promise}                 A $q promise that resolves to posted
     *                                   activities.
     */
    service.logActivities = function (loggedActivities) {
      if (!user.isAuthenticated) {
        return util.q.makeRejectedPromise('Must be authenticated');
      }
      if(!angular.isArray(loggedActivities) || !loggedActivities.length) {
        return util.q.makeRejectedPromise('logActivities: expects an array of activities');
      }
      //chai.expect(loggedActivities.length).to.be.above(0);
      var allRequests = [];

      return util.q.makeResolvedPromise().then(function() {
        var activitiesLogged = [];  // this will contain all the successfully logged requests when the promise returned resolves.
        loggedActivities.forEach(function (activity) {
          var clone = _.cloneDeep(activity);
          
          clone.date = clone.date || new Date().toISOString();

          var request = server.post(API.activityLogEndpoint, activity)
              .then(function (savedActivity) {
                // todo: anything that needs to be done upon success.
                cache.push('activity_log', savedActivity);
                activitiesLogged.push(savedActivity);
                return savedActivity;
              },
              function error(response) {
                // A 500 could indicate a temporary failure, in which case we would want to serverPostQueue it later.
                if (response === 'offline' || response.status_code === 500) {
                  // Let's queue it up to be serverPostQueueed later if we are offline or the a temporary error occurred.
                  serverPostQueue.queue(API.activityLogEndpoint, activity);

                  // NOTE: if server always rejects the activity, the client will not become inconsistent
                  // because the cached activity_log will get updated with the server values eventually.
                  cache.push('activity_log', activity);
                  activitiesLogged.push(activity);
                } else {
                  // something bad happened, maybe the activity id no longer exists on the server,
                  // for whatever reason, this activity cannot be saved permanently.  In this case
                  // we must send error to client:
                  throw response;
                }
              });
          allRequests.push(request);
        });

        return $q.all(allRequests).then(function() {
          service.activityLog = service.activityLog.concat(activitiesLogged);
          return activitiesLogged;
        });
      });
    
    };

     /**
     * promise for when this service is fully loaded
     *
     * @return {promise}                 A $q promise that resolves when initialize finishes
     * 
     */
    var readyPromise = service.loadActivityCategories();
    service.whenReady = function () {
      return readyPromise;
    };

    return service;
  }
])//ACTIVITIES SERVICE
.factory('mockActivitiesServer',['$q', 'util', 'API_CONSTANTS',
 function($q,utils,API_CONSTANTS){
    'use strict';
    var service = {
      categories: [] // an array of currently loaded items
    };

   

    var activityCategories = [
            {
                "activityCategoryId": 13,
                "activityCategoryDisplayName": "Cardio",
                "activities": [
                    {
                        "activityName": "Cycling",
                        "activityUnits": [
                            {
                                "unitId": 107,
                                "unitName": "mins",
                                "unitPoints": 7.5
                            },
                            {
                                "unitId": 106,
                                "unitName": "km",
                                "unitPoints": 25.4198
                            }
                        ]
                    },
                    {
                        "activityName": "Dancing",
                        "activityUnits": [
                            {
                                "unitId": 1529,
                                "unitName": "mins",
                                "unitPoints": 4.5
                            }
                        ]
                    },
                    {
                        "activityName": "Elliptical",
                        "activityUnits": [
                            {
                                "unitId": 257,
                                "unitName": "mins",
                                "unitPoints": 5.5
                            }
                        ]
                    },
                    {
                        "activityName": "Group exercise",
                        "activityUnits": [
                            {
                                "unitId": 110,
                                "unitName": "mins",
                                "unitPoints": 6.83
                            }
                        ]
                    },
                    {
                        "activityName": "HIIT",
                        "activityUnits": [
                            {
                                "unitId": 3241,
                                "unitName": "mins",
                                "unitPoints": 12.5
                            }
                        ]
                    },
                    {
                        "activityName": "Hiking ",
                        "activityUnits": [
                            {
                                "unitId": 741,
                                "unitName": "mins",
                                "unitPoints": 6
                            }
                        ]
                    },
                    {
                        "activityName": "House work",
                        "activityUnits": [
                            {
                                "unitId": 154,
                                "unitName": "mins",
                                "unitPoints": 1.93
                            }
                        ]
                    },
                    {
                        "activityName": "Jumping rope",
                        "activityUnits": [
                            {
                                "unitId": 1534,
                                "unitName": "secs",
                                "unitPoints": 0.1833
                            }
                        ]
                    },
                    {
                        "activityName": "Running",
                        "activityUnits": [
                            {
                                "unitId": 105,
                                "unitName": "mins",
                                "unitPoints": 8.3
                            },
                            {
                                "unitId": 104,
                                "unitName": "km",
                                "unitPoints": 61.8887
                            }
                        ]
                    },
                    {
                        "activityName": "Skating",
                        "activityUnits": [
                            {
                                "unitId": 1528,
                                "unitName": "mins",
                                "unitPoints": 7
                            }
                        ]
                    },
                    {
                        "activityName": "Skiing - cross country",
                        "activityUnits": [
                            {
                                "unitId": 1532,
                                "unitName": "mins",
                                "unitPoints": 8
                            }
                        ]
                    },
                    {
                        "activityName": "Skiing - downhill",
                        "activityUnits": [
                            {
                                "unitId": 1533,
                                "unitName": "mins",
                                "unitPoints": 7
                            }
                        ]
                    },
                    {
                        "activityName": "Snow shovelling",
                        "activityUnits": [
                            {
                                "unitId": 108,
                                "unitName": "mins",
                                "unitPoints": 6
                            }
                        ]
                    },
                    {
                        "activityName": "Snow-shoeing ",
                        "activityUnits": [
                            {
                                "unitId": 1530,
                                "unitName": "mins",
                                "unitPoints": 7.5
                            }
                        ]
                    },
                    {
                        "activityName": "Snowboarding ",
                        "activityUnits": [
                            {
                                "unitId": 1531,
                                "unitName": "mins",
                                "unitPoints": 7
                            }
                        ]
                    },
                    {
                        "activityName": "Sprints",
                        "activityUnits": [
                            {
                                "unitId": 1711,
                                "unitName": "secs",
                                "unitPoints": 0.1833
                            }
                        ]
                    },
                    {
                        "activityName": "Stair climbing",
                        "activityUnits": [
                            {
                                "unitId": 111,
                                "unitName": "steps",
                                "unitPoints": 0.0667
                            },
                            {
                                "unitId": 155,
                                "unitName": "flights",
                                "unitPoints": 1.144
                            },
                            {
                                "unitId": 112,
                                "unitName": "mins",
                                "unitPoints": 4
                            }
                        ]
                    },
                    {
                        "activityName": "Swimming",
                        "activityUnits": [
                            {
                                "unitId": 114,
                                "unitName": "km",
                                "unitPoints": 114.1503
                            },
                            {
                                "unitId": 113,
                                "unitName": "mins",
                                "unitPoints": 8.3
                            },
                            {
                                "unitId": 115,
                                "unitName": "laps",
                                "unitPoints": 2.6349
                            }
                        ]
                    },
                    {
                        "activityName": "Walking",
                        "activityUnits": [
                            {
                                "unitId": 118,
                                "unitName": "mins",
                                "unitPoints": 3.5
                            },
                            {
                                "unitId": 117,
                                "unitName": "steps",
                                "unitPoints": 0.03
                            },
                            {
                                "unitId": 116,
                                "unitName": "km",
                                "unitPoints": 43.4961
                            }
                        ]
                    }
                ]
            },
            {
                "activityCategoryId": 16,
                "activityCategoryDisplayName": "Feel Good",
                "activities": [
                    {
                        "activityName": "Acts of kindness",
                        "activityUnits": [
                            {
                                "unitId": 144,
                                "unitName": "actions",
                                "unitPoints": 71.4286
                            }
                        ]
                    },
                    {
                        "activityName": "Breathe",
                        "activityUnits": [
                            {
                                "unitId": 143,
                                "unitName": "deep breaths",
                                "unitPoints": 7.1429
                            }
                        ]
                    },
                    {
                        "activityName": "Cell phone off",
                        "activityUnits": [
                            {
                                "unitId": 2187,
                                "unitName": "mins",
                                "unitPoints": 1.1905
                            }
                        ]
                    },
                    {
                        "activityName": "Hobbies",
                        "activityUnits": [
                            {
                                "unitId": 145,
                                "unitName": "mins",
                                "unitPoints": 3.5714
                            }
                        ]
                    },
                    {
                        "activityName": "Meditate",
                        "activityUnits": [
                            {
                                "unitId": 147,
                                "unitName": "mins",
                                "unitPoints": 7.1429
                            }
                        ]
                    },
                    {
                        "activityName": "Sleep",
                        "activityUnits": [
                            {
                                "unitId": 142,
                                "unitName": "hrs",
                                "unitPoints": 10.2041
                            }
                        ]
                    },
                    {
                        "activityName": "Stretch",
                        "activityUnits": [
                            {
                                "unitId": 146,
                                "unitName": "mins",
                                "unitPoints": 3.5714
                            }
                        ]
                    },
                    {
                        "activityName": "Volunteer ",
                        "activityUnits": [
                            {
                                "unitId": 420,
                                "unitName": "mins",
                                "unitPoints": 7.1429
                            }
                        ]
                    }
                ]
            },
            {
                "activityCategoryId": 18,
                "activityCategoryDisplayName": "Lifestyle",
                "activities": [
                    {
                        "activityName": "Dentist",
                        "activityUnits": [
                            {
                                "unitId": 1527,
                                "unitName": "visits",
                                "unitPoints": 500
                            }
                        ]
                    },
                    {
                        "activityName": "Doctor",
                        "activityUnits": [
                            {
                                "unitId": 1526,
                                "unitName": "visits",
                                "unitPoints": 500
                            }
                        ]
                    },
                    {
                        "activityName": "Health risk assessment",
                        "activityUnits": [
                            {
                                "unitId": 1540,
                                "unitName": "report",
                                "unitPoints": 500
                            }
                        ]
                    },
                    {
                        "activityName": "Reduce alcohol",
                        "activityUnits": [
                            {
                                "unitId": 1525,
                                "unitName": "less drinks",
                                "unitPoints": 25
                            }
                        ]
                    },
                    {
                        "activityName": "Reduce smoking",
                        "activityUnits": [
                            {
                                "unitId": 1524,
                                "unitName": "less cigarettes",
                                "unitPoints": 25
                            }
                        ]
                    },
                    {
                        "activityName": "Weight loss",
                        "activityUnits": [
                            {
                                "unitId": 1523,
                                "unitName": "lbs per week",
                                "unitPoints": 250
                            }
                        ]
                    }
                ]
            },
            {
                "activityCategoryId": 17,
                "activityCategoryDisplayName": "Nutrition",
                "activities": [
                    {
                        "activityName": "Bring lunch from home",
                        "activityUnits": [
                            {
                                "unitId": 2455,
                                "unitName": "meals",
                                "unitPoints": 15
                            }
                        ]
                    },
                    {
                        "activityName": "Free-range poultry",
                        "activityUnits": [
                            {
                                "unitId": 1522,
                                "unitName": "servings",
                                "unitPoints": 5
                            }
                        ]
                    },
                    {
                        "activityName": "Fruits/Veggies",
                        "activityUnits": [
                            {
                                "unitId": 148,
                                "unitName": "servings",
                                "unitPoints": 2.8571
                            }
                        ]
                    },
                    {
                        "activityName": "Give it up",
                        "activityUnits": [
                            {
                                "unitId": 2174,
                                "unitName": "items",
                                "unitPoints": 10
                            }
                        ]
                    },
                    {
                        "activityName": "Grass-fed, grass-finished meat",
                        "activityUnits": [
                            {
                                "unitId": 1521,
                                "unitName": "servings",
                                "unitPoints": 5
                            }
                        ]
                    },
                    {
                        "activityName": "Light dinner",
                        "activityUnits": [
                            {
                                "unitId": 1520,
                                "unitName": "meals",
                                "unitPoints": 25
                            }
                        ]
                    },
                    {
                        "activityName": "Portion control",
                        "activityUnits": [
                            {
                                "unitId": 2555,
                                "unitName": "meal/snack",
                                "unitPoints": 2.8571
                            }
                        ]
                    },
                    {
                        "activityName": "Power lunch",
                        "activityUnits": [
                            {
                                "unitId": 2173,
                                "unitName": "meals",
                                "unitPoints": 10
                            }
                        ]
                    },
                    {
                        "activityName": "Power lunch - home",
                        "activityUnits": [
                            {
                                "unitId": 415,
                                "unitName": "meals",
                                "unitPoints": 14.2857
                            }
                        ]
                    },
                    {
                        "activityName": "Read food labels",
                        "activityUnits": [
                            {
                                "unitId": 2556,
                                "unitName": "packaged food",
                                "unitPoints": 25
                            }
                        ]
                    },
                    {
                        "activityName": "Water",
                        "activityUnits": [
                            {
                                "unitId": 149,
                                "unitName": "glasses",
                                "unitPoints": 1.7857
                            }
                        ]
                    },
                    {
                        "activityName": "Wholesome breakfast",
                        "activityUnits": [
                            {
                                "unitId": 412,
                                "unitName": "meals",
                                "unitPoints": 14.2857
                            }
                        ]
                    },
                    {
                        "activityName": "Wild fish",
                        "activityUnits": [
                            {
                                "unitId": 413,
                                "unitName": "servings",
                                "unitPoints": 5
                            }
                        ]
                    }
                ]
            },
            {
                "activityCategoryId": 15,
                "activityCategoryDisplayName": "Play",
                "activities": [
                    {
                        "activityName": "Badminton",
                        "activityUnits": [
                            {
                                "unitId": 127,
                                "unitName": "mins",
                                "unitPoints": 6
                            }
                        ]
                    },
                    {
                        "activityName": "Baseball",
                        "activityUnits": [
                            {
                                "unitId": 128,
                                "unitName": "mins",
                                "unitPoints": 5
                            }
                        ]
                    },
                    {
                        "activityName": "Basketball",
                        "activityUnits": [
                            {
                                "unitId": 129,
                                "unitName": "mins",
                                "unitPoints": 8
                            }
                        ]
                    },
                    {
                        "activityName": "Bowling",
                        "activityUnits": [
                            {
                                "unitId": 130,
                                "unitName": "mins",
                                "unitPoints": 3
                            }
                        ]
                    },
                    {
                        "activityName": "Curling",
                        "activityUnits": [
                            {
                                "unitId": 131,
                                "unitName": "mins",
                                "unitPoints": 3.5
                            }
                        ]
                    },
                    {
                        "activityName": "Football",
                        "activityUnits": [
                            {
                                "unitId": 1518,
                                "unitName": "mins",
                                "unitPoints": 8
                            }
                        ]
                    },
                    {
                        "activityName": "Golfing - with cart ",
                        "activityUnits": [
                            {
                                "unitId": 133,
                                "unitName": "mins",
                                "unitPoints": 0
                            }
                        ]
                    },
                    {
                        "activityName": "Golfing - without cart",
                        "activityUnits": [
                            {
                                "unitId": 134,
                                "unitName": "mins",
                                "unitPoints": 3.75
                            }
                        ]
                    },
                    {
                        "activityName": "Hockey",
                        "activityUnits": [
                            {
                                "unitId": 140,
                                "unitName": "mins",
                                "unitPoints": 8
                            }
                        ]
                    },
                    {
                        "activityName": "Martial arts ",
                        "activityUnits": [
                            {
                                "unitId": 533,
                                "unitName": "mins",
                                "unitPoints": 10
                            }
                        ]
                    },
                    {
                        "activityName": "Mountain sports",
                        "activityUnits": [
                            {
                                "unitId": 132,
                                "unitName": "mins",
                                "unitPoints": 0
                            }
                        ]
                    },
                    {
                        "activityName": "Rock climbing",
                        "activityUnits": [
                            {
                                "unitId": 136,
                                "unitName": "mins",
                                "unitPoints": 9.5
                            }
                        ]
                    },
                    {
                        "activityName": "Rugby",
                        "activityUnits": [
                            {
                                "unitId": 137,
                                "unitName": "mins",
                                "unitPoints": 10
                            }
                        ]
                    },
                    {
                        "activityName": "Soccer",
                        "activityUnits": [
                            {
                                "unitId": 139,
                                "unitName": "mins",
                                "unitPoints": 7
                            }
                        ]
                    },
                    {
                        "activityName": "Squash",
                        "activityUnits": [
                            {
                                "unitId": 1538,
                                "unitName": "mins",
                                "unitPoints": 10
                            }
                        ]
                    },
                    {
                        "activityName": "Tennis",
                        "activityUnits": [
                            {
                                "unitId": 1537,
                                "unitName": "mins",
                                "unitPoints": 7
                            }
                        ]
                    },
                    {
                        "activityName": "Ultimate frisbee",
                        "activityUnits": [
                            {
                                "unitId": 138,
                                "unitName": "mins",
                                "unitPoints": 5
                            }
                        ]
                    },
                    {
                        "activityName": "Volleyball",
                        "activityUnits": [
                            {
                                "unitId": 135,
                                "unitName": "mins",
                                "unitPoints": 5.5
                            }
                        ]
                    },
                    {
                        "activityName": "Water sports",
                        "activityUnits": [
                            {
                                "unitId": 641,
                                "unitName": "kms",
                                "unitPoints": 0
                            },
                            {
                                "unitId": 141,
                                "unitName": "mins",
                                "unitPoints": 5.22
                            }
                        ]
                    }
                ]
            },
            {
                "activityCategoryId": 14,
                "activityCategoryDisplayName": "Strength",
                "activities": [
                    {
                        "activityName": "Abs",
                        "activityUnits": [
                            {
                                "unitId": 1504,
                                "unitName": "mins",
                                "unitPoints": 0
                            },
                            {
                                "unitId": 120,
                                "unitName": "reps",
                                "unitPoints": 0.25
                            }
                        ]
                    },
                    {
                        "activityName": "Dead lifts",
                        "activityUnits": [
                            {
                                "unitId": 1442,
                                "unitName": "reps",
                                "unitPoints": 0.45
                            }
                        ]
                    },
                    {
                        "activityName": "Lunges",
                        "activityUnits": [
                            {
                                "unitId": 1536,
                                "unitName": "reps",
                                "unitPoints": 0.45
                            }
                        ]
                    },
                    {
                        "activityName": "Pilates",
                        "activityUnits": [
                            {
                                "unitId": 123,
                                "unitName": "mins",
                                "unitPoints": 2.5
                            }
                        ]
                    },
                    {
                        "activityName": "Plank",
                        "activityUnits": [
                            {
                                "unitId": 151,
                                "unitName": "secs",
                                "unitPoints": 0.06
                            }
                        ]
                    },
                    {
                        "activityName": "Pull-ups",
                        "activityUnits": [
                            {
                                "unitId": 122,
                                "unitName": "reps",
                                "unitPoints": 1.35
                            }
                        ]
                    },
                    {
                        "activityName": "Push-ups",
                        "activityUnits": [
                            {
                                "unitId": 121,
                                "unitName": "reps",
                                "unitPoints": 0.45
                            }
                        ]
                    },
                    {
                        "activityName": "Rows",
                        "activityUnits": [
                            {
                                "unitId": 1535,
                                "unitName": "reps",
                                "unitPoints": 0.45
                            }
                        ]
                    },
                    {
                        "activityName": "Squats",
                        "activityUnits": [
                            {
                                "unitId": 153,
                                "unitName": "reps",
                                "unitPoints": 0.45
                            },
                            {
                                "unitId": 152,
                                "unitName": "secs",
                                "unitPoints": 0
                            }
                        ]
                    },
                    {
                        "activityName": "Strength training",
                        "activityUnits": [
                            {
                                "unitId": 126,
                                "unitName": "reps",
                                "unitPoints": 0.45
                            },
                            {
                                "unitId": 125,
                                "unitName": "mins",
                                "unitPoints": 4.1667
                            }
                        ]
                    },
                    {
                        "activityName": "Yoga",
                        "activityUnits": [
                            {
                                "unitId": 124,
                                "unitName": "mins",
                                "unitPoints": 3.3333
                            }
                        ]
                    }
                ]
            }
        ];
  
    //SR NOTE: activityDisplayName is not defined in the API currently, but should be.
   

    return {
        get : function(url,query) {
          var deferred = $q.defer();
          switch(url){
            case API_CONSTANTS.activityCategoryEndpoint:
              deferred.resolve(activityCategories);
            break;
            case API_CONSTANTS.activityLogEndpoint:
                //note: low-dash removes items from the source array when using .remove() so we re-init the arrays for each req
                //lazy, but stuff to do
                var now = new Date();
                 var activityLogs = [{activityLogId:1, activityUnitId:107,"quantity":40,"points":2,"date":now.toUTCString()},
                        {activityLogId:2,  activityUnitId:106,"quantity":60,"points":3,"date":now.toUTCString()},
                        {activityLogId:3,  activityUnitId:1529,"quantity":90,"points":4,"date":now.toUTCString()}];
                var yesterday = new Date();
                yesterday.setDate(now.getDate() -1 );
                var yesterdayActivityLogs = [{activityLogId:4, activityUnitId:257,"quantity":40,"points":20,"date":yesterday.toUTCString()},
                                    {activityLogId:5,  activityUnitId:110,"quantity":60,"points":30,"date":yesterday.toUTCString()},
                                    {activityLogId:6,  activityUnitId:107,"quantity":90,"points":40,"date":yesterday.toUTCString()}];
                var lastWeek = new Date();
                lastWeek.setDate(now.getDate() - 7 );
                var lastWeekActivityLogs = [{activityLogId:7, activityUnitId:3241,"quantity":40,"points":200,"date":lastWeek.toUTCString()},
                                    {activityLogId:8,  activityUnitId:741,"quantity":60,"points":300,"date":lastWeek.toUTCString()},
                                    {activityLogId:9,  activityUnitId:1528,"quantity":90,"points":400,"date":lastWeek.toUTCString()}];
                var lastMonth= new Date();
                lastMonth.setDate(now.getDate() - 31);
                var lastMonthActivityLogs = [{activityLogId:10, activityUnitId:154,"quantity":40,"points":2000,"date":lastMonth.toUTCString()},
                                    {activityLogId:11,  activityUnitId:1534,"quantity":60,"points":3000,"date":lastMonth.toUTCString()},
                                    {activityLogId:12,  activityUnitId:104,"quantity":90,"points":4000,"date":lastMonth.toUTCString()}];

                var laterDate= new Date();
                laterDate.setDate(now.getDate() - 60);
                var laterActLogs = [{activityLogId:13, activityUnitId:1528,"quantity":401,"points":20000,"date":laterDate.toUTCString()},
                                    {activityLogId:14,  activityUnitId:1528,"quantity":601,"points":30000,"date":laterDate.toUTCString()},
                                    {activityLogId:15,  activityUnitId:1528,"quantity":901,"points":40000,"date":laterDate.toUTCString()}];


                var PAGE_SIZE = 2; //small value to test pagination
                var logs;
                switch(''+query.timePeriodId){
                    case '1':
                        logs = activityLogs;
                        
                    break;
                    case '2':
                        logs = yesterdayActivityLogs;
                    break;
                    case '3':
                        logs = _.union(activityLogs, yesterdayActivityLogs);
                    break;
                    case '4':
                        logs = _.union(activityLogs, yesterdayActivityLogs,lastWeekActivityLogs,lastMonthActivityLogs);
                    break;
                    case 'year':
                        logs = _.union(activityLogs, yesterdayActivityLogs,lastWeekActivityLogs, lastMonthActivityLogs, laterActLogs);
                    break;
                    default:
                        logs = activityLogs;
                    break;
                }
                var result = _.chain(logs)
                             .remove(function(log){
                                if(!query || !query.idGreaterThan) return true;
                                return log.activityLogId > query.idGreaterThan;
                            })
                            .first(PAGE_SIZE);
                
                deferred.resolve(result.value());
            break;            
            default:
              deferred.reject('the mock scores factory received an unexpected url: '+url);
            break;
          }

          return deferred.promise;
        },
        post : function(url,data) {
          var deferred = $q.defer();
          switch(url){
            case API_CONSTANTS.activityLogEndpoint:
              deferred.resolve({streamItemId:9999});
            break;            
            default:
              deferred.reject('the mock scores factory received an unexpected url: '+url);
            break;
          }

          return deferred.promise;
        }
    }; 
 }
]);//mockActivitiesServer
