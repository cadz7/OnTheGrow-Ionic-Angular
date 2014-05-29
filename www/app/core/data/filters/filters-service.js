angular.module('sproutApp.data.filters', [
  'sproutApp.config',
  'sproutApp.user',
  'sproutApp.server',
  'sproutApp.cache',
  'sproutApp.server-post-queue',
  'sproutApp.util'
])

.factory('filters', ['$q', 'user', 'util', 'filtersMockServer', 'API_CONSTANTS','$log',
  function ($q, user, util, server, API_CONSTANTS, $log) {
    var service = {
      streamItemFilters : [],
      userFilters : [],
      activityFilters :[],
      timePeriodFilters:[],
      shareWithFilters : [],
      defaultTimePeriod : null
    };

   // var whenReady = $q.defer();
    /**
     * Returns a promise that resolves when the and user has been authenticated and filters have been loaded. This is
     * to account for the case where the app starts in a non-authenticated mode
     * and goes into the authenticated mode later.
     *
     * @return {promise}               A $q promise that resolves when the user
     *                                 is authenticated.
     */
    service.whenReady = function(){
      return whenReady.promise;
    };


    var loadFilters = function (){
      return user.whenAuthenticated()
                .then(function(){
                  return server.get(API_CONSTANTS.filtersEndpoint)
                })
                .then(function(filters){
                  //console.log(filters)
                  angular.forEach(filters,function(filter){
                    
                    switch(filter.filterType){


                      case 'stream_items':
                        service.streamItemFilters.push(filter);
                      break;
                      case 'leaderboard':
                        service.userFilters.push(filter);          
                      break;
                      case 'time_periods':
                        //set default time period filter to 'this month'. API currently does not do this for us, so here is a hack
                        if(filter.displayName.toLowerCase().indexOf('month') >= 0)
                          service.defaultTimePeriod = filter;
                        service.timePeriodFilters.push(filter);            
                      break;
                      case 'activities':
                        service.activityFilters.push(filter);          
                      break;
                      case 'share_with':
                        service.shareWithFilters.push(filter);            
                      break;
                      default :
                        $log.debug('filter given with unknown filter type: ',filter);
                    }
                  });

                  if(service.defaultTimePeriod === null){
                    //fallback default time period
                    service.defaultTimePeriod = service.timePeriodFilters[0];
                  }

                  $log.debug('filters loaded');
                  whenReady.resolve();
                })
                .then(null,function(error){
                  $log.error('failed to load filters',error);
                });       
    }
    var whenReady = $q.defer();
    loadFilters();

    return service;
  }
])
.factory('filtersMockServer', ['$q','util', function($q,util){
  var filters = [
                  {
                      "filterId": 1,
                      "displayName": "Today",
                      "filterType": "time_periods",
                      "subFilters": []
                  },
                  {
                      "filterId": 2,
                      "displayName": "Yesterday",
                      "filterType": "time_periods",
                      "subFilters": []
                  },
                  {
                      "filterId": 3,
                      "displayName": "This week",
                      "filterType": "time_periods",
                      "subFilters": []
                  },
                  {
                      "filterId": 4,
                      "displayName": "This month",
                      "filterType": "time_periods",
                      "subFilters": []
                  },
                  {
                      "filterId": 5,
                      "displayName": "All",
                      "filterType": "stream_items",
                      "subFilters": []
                  },
                  {
                      "filterId": 6,
                      "displayName": "Your Department",
                      "filterType": "stream_items",
                      "subFilters": []
                  },
                  {
                      "filterId": 7,
                      "displayName": "Your Location",
                      "filterType": "stream_items",
                      "subFilters": []
                  },
                  {
                      "filterId": 9,
                      "displayName": "Company",
                      "filterType": "leaderboard",
                      "subFilters": []
                  },
                  {
                      "filterId": 8,
                      "displayName": "All Activities",
                      "filterType": "activities",
                      "subFilters": [
                       {
                              "filterId": "activity-2908",
                              "displayName": "BONUS Flash Points",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-84",
                              "displayName": "Cycling",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1244",
                              "displayName": "Dancing",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-210",
                              "displayName": "Elliptical",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2819",
                              "displayName": "Fitbit active",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2820",
                              "displayName": "Fitbit very active",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-87",
                              "displayName": "Group exercise",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2725",
                              "displayName": "HIIT",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-607",
                              "displayName": "Hiking ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-124",
                              "displayName": "House work",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1249",
                              "displayName": "Jumping rope",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2131",
                              "displayName": "Nike FuelBand mod-high",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-83",
                              "displayName": "Running",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2551",
                              "displayName": "Running with Nike+ Android app",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2550",
                              "displayName": "Running with Nike+ iPhone app",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2552",
                              "displayName": "Running with Nike+ iPod Nano",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2554",
                              "displayName": "Running with Nike+ SportBand",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2553",
                              "displayName": "Running with Nike+ Sportswatch",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1243",
                              "displayName": "Skating",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1247",
                              "displayName": "Skiing - cross country",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1248",
                              "displayName": "Skiing - downhill",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-85",
                              "displayName": "Snow shovelling",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1245",
                              "displayName": "Snow-shoeing ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1246",
                              "displayName": "Snowboarding ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1410",
                              "displayName": "Sprints",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-88",
                              "displayName": "Stair climbing",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-89",
                              "displayName": "Swimming",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-90",
                              "displayName": "Walking",
                              "filterType": "activities",
                              "subFilters": []
                          },
                           {
                              "filterId": "activity-115",
                              "displayName": "Acts of kindness",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-114",
                              "displayName": "Breathe",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1818",
                              "displayName": "Cell phone off",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-116",
                              "displayName": "Hobbies",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-118",
                              "displayName": "Meditate",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-113",
                              "displayName": "Sleep",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-117",
                              "displayName": "Stretch",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-344",
                              "displayName": "Volunteer ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                           {
                              "filterId": "activity-1242",
                              "displayName": "Dentist",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1241",
                              "displayName": "Doctor",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1256",
                              "displayName": "Health risk assessment",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1240",
                              "displayName": "Reduce alcohol",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1239",
                              "displayName": "Reduce smoking",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-121",
                              "displayName": "Weight loss",
                              "filterType": "activities",
                              "subFilters": []
                          },
                           {
                              "filterId": "activity-2821",
                              "displayName": "Fitbit low",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2911",
                              "displayName": "Nike FuelBand low",
                              "filterType": "activities",
                              "subFilters": []
                          },
                           {
                              "filterId": "activity-98",
                              "displayName": "Badminton",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-99",
                              "displayName": "Baseball",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-100",
                              "displayName": "Basketball",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-101",
                              "displayName": "Bowling",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-102",
                              "displayName": "Curling",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1234",
                              "displayName": "Football",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-104",
                              "displayName": "Golfing - with cart ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-105",
                              "displayName": "Golfing - without cart",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-111",
                              "displayName": "Hockey",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-437",
                              "displayName": "Martial arts ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-103",
                              "displayName": "Mountain sports",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-107",
                              "displayName": "Rock climbing",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-108",
                              "displayName": "Rugby",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-110",
                              "displayName": "Soccer",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1254",
                              "displayName": "Squash",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1253",
                              "displayName": "Tennis",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-109",
                              "displayName": "Ultimate frisbee",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-106",
                              "displayName": "Volleyball",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-112",
                              "displayName": "Water sports",
                              "filterType": "activities",
                              "subFilters": []
                          },
                           {
                              "filterId": "activity-92",
                              "displayName": "Abs",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1169",
                              "displayName": "Dead lifts",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1251",
                              "displayName": "Lunges",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-95",
                              "displayName": "Pilates",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-122",
                              "displayName": "Plank",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-94",
                              "displayName": "Pull-ups",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-93",
                              "displayName": "Push-ups",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1250",
                              "displayName": "Rows",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-91",
                              "displayName": "Squats",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-97",
                              "displayName": "Strength training",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-96",
                              "displayName": "Yoga",
                              "filterType": "activities",
                              "subFilters": []
                          }
                      ]
                  },
                  {
                      "filterId": "activityCategory-13",
                      "displayName": "Cardio",
                      "filterType": "activities",
                      "subFilters": [
                          {
                              "filterId": "activity-2908",
                              "displayName": "BONUS Flash Points",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-84",
                              "displayName": "Cycling",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1244",
                              "displayName": "Dancing",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-210",
                              "displayName": "Elliptical",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2819",
                              "displayName": "Fitbit active",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2820",
                              "displayName": "Fitbit very active",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-87",
                              "displayName": "Group exercise",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2725",
                              "displayName": "HIIT",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-607",
                              "displayName": "Hiking ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-124",
                              "displayName": "House work",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1249",
                              "displayName": "Jumping rope",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2131",
                              "displayName": "Nike FuelBand mod-high",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-83",
                              "displayName": "Running",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2551",
                              "displayName": "Running with Nike+ Android app",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2550",
                              "displayName": "Running with Nike+ iPhone app",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2552",
                              "displayName": "Running with Nike+ iPod Nano",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2554",
                              "displayName": "Running with Nike+ SportBand",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2553",
                              "displayName": "Running with Nike+ Sportswatch",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1243",
                              "displayName": "Skating",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1247",
                              "displayName": "Skiing - cross country",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1248",
                              "displayName": "Skiing - downhill",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-85",
                              "displayName": "Snow shovelling",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1245",
                              "displayName": "Snow-shoeing ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1246",
                              "displayName": "Snowboarding ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1410",
                              "displayName": "Sprints",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-88",
                              "displayName": "Stair climbing",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-89",
                              "displayName": "Swimming",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-90",
                              "displayName": "Walking",
                              "filterType": "activities",
                              "subFilters": []
                          }
                      ]
                  },
                  {
                      "filterId": "activityCategory-16",
                      "displayName": "Feel Good",
                      "filterType": "activities",
                      "subFilters": [
                          {
                              "filterId": "activity-115",
                              "displayName": "Acts of kindness",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-114",
                              "displayName": "Breathe",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1818",
                              "displayName": "Cell phone off",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-116",
                              "displayName": "Hobbies",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-118",
                              "displayName": "Meditate",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-113",
                              "displayName": "Sleep",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-117",
                              "displayName": "Stretch",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-344",
                              "displayName": "Volunteer ",
                              "filterType": "activities",
                              "subFilters": []
                          }
                      ]
                  },
                  {
                      "filterId": "activityCategory-18",
                      "displayName": "Lifestyle",
                      "filterType": "activities",
                      "subFilters": [
                          {
                              "filterId": "activity-1242",
                              "displayName": "Dentist",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1241",
                              "displayName": "Doctor",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1256",
                              "displayName": "Health risk assessment",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1240",
                              "displayName": "Reduce alcohol",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1239",
                              "displayName": "Reduce smoking",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-121",
                              "displayName": "Weight loss",
                              "filterType": "activities",
                              "subFilters": []
                          }
                      ]
                  },
                  {
                      "filterId": "activityCategory-300",
                      "displayName": "Move",
                      "filterType": "activities",
                      "subFilters": [
                          {
                              "filterId": "activity-2821",
                              "displayName": "Fitbit low",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2911",
                              "displayName": "Nike FuelBand low",
                              "filterType": "activities",
                              "subFilters": []
                          }
                      ]
                  },
                  {
                      "filterId": "activityCategory-17",
                      "displayName": "Nutrition",
                      "filterType": "activities",
                      "subFilters": [
                          {
                              "filterId": "activity-2049",
                              "displayName": "Bring lunch from home",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1238",
                              "displayName": "Free-range poultry",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-119",
                              "displayName": "Fruits/Veggies",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1805",
                              "displayName": "Give it up",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1237",
                              "displayName": "Grass-fed, grass-finished meat",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1236",
                              "displayName": "Light dinner",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2133",
                              "displayName": "Portion control",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1804",
                              "displayName": "Power lunch",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-339",
                              "displayName": "Power lunch - home",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-2134",
                              "displayName": "Read food labels",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-120",
                              "displayName": "Water",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-337",
                              "displayName": "Wholesome breakfast",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-338",
                              "displayName": "Wild fish",
                              "filterType": "activities",
                              "subFilters": []
                          }
                      ]
                  },
                  {
                      "filterId": "activityCategory-15",
                      "displayName": "Play",
                      "filterType": "activities",
                      "subFilters": [
                          {
                              "filterId": "activity-98",
                              "displayName": "Badminton",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-99",
                              "displayName": "Baseball",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-100",
                              "displayName": "Basketball",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-101",
                              "displayName": "Bowling",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-102",
                              "displayName": "Curling",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1234",
                              "displayName": "Football",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-104",
                              "displayName": "Golfing - with cart ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-105",
                              "displayName": "Golfing - without cart",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-111",
                              "displayName": "Hockey",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-437",
                              "displayName": "Martial arts ",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-103",
                              "displayName": "Mountain sports",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-107",
                              "displayName": "Rock climbing",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-108",
                              "displayName": "Rugby",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-110",
                              "displayName": "Soccer",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1254",
                              "displayName": "Squash",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1253",
                              "displayName": "Tennis",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-109",
                              "displayName": "Ultimate frisbee",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-106",
                              "displayName": "Volleyball",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-112",
                              "displayName": "Water sports",
                              "filterType": "activities",
                              "subFilters": []
                          }
                      ]
                  },
                  {
                      "filterId": "activityCategory-14",
                      "displayName": "Strength",
                      "filterType": "activities",
                      "subFilters": [
                          {
                              "filterId": "activity-92",
                              "displayName": "Abs",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1169",
                              "displayName": "Dead lifts",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1251",
                              "displayName": "Lunges",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-95",
                              "displayName": "Pilates",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-122",
                              "displayName": "Plank",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-94",
                              "displayName": "Pull-ups",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-93",
                              "displayName": "Push-ups",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-1250",
                              "displayName": "Rows",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-91",
                              "displayName": "Squats",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-97",
                              "displayName": "Strength training",
                              "filterType": "activities",
                              "subFilters": []
                          },
                          {
                              "filterId": "activity-96",
                              "displayName": "Yoga",
                              "filterType": "activities",
                              "subFilters": []
                          }
                      ]
                  },
                  {
                      "filterId": 500,
                      "displayName": "EVERYONE",
                      "filterType": "share_with",
                      "subFilters": []
                  },
              ]       
  return {
    get : function(url,query){
      return util.q.makeResolvedPromise(filters);
    }
  };
}])
