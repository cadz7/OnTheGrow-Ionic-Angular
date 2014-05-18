angular.module('sproutApp.data.activities', [
  'sproutApp.user',
  'sproutApp.util'
])

.factory('activities', ['$q', 'user', 'util',
  function ($q, user, util) {
    'use strict';
    var service = {
      categories: [] // an array of currently loaded items
    };

    var flatActivities = [{
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Running',
      'unitId': 104,
      'unitName': 'km'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Running',
      'unitId': 105,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Cycling',
      'unitId': 106,
      'unitName': 'km'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Cycling',
      'unitId': 107,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Snow shovelling',
      'unitId': 108,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Group exercise',
      'unitId': 110,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Stair climbing',
      'unitId': 111,
      'unitName': 'steps'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Stair climbing',
      'unitId': 112,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Stair climbing',
      'unitId': 155,
      'unitName': 'flights'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Swimming',
      'unitId': 113,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Swimming',
      'unitId': 114,
      'unitName': 'km'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Swimming',
      'unitId': 115,
      'unitName': 'laps'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Walking',
      'unitId': 116,
      'unitName': 'km'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Walking',
      'unitId': 117,
      'unitName': 'steps'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Walking',
      'unitId': 118,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'House work',
      'unitId': 154,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Elliptical',
      'unitId': 257,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Hiking ',
      'unitId': 741,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Skating',
      'unitId': 1528,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Dancing',
      'unitId': 1529,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Snow-shoeing ',
      'unitId': 1530,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Snowboarding ',
      'unitId': 1531,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Skiing - cross country',
      'unitId': 1532,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Skiing - downhill',
      'unitId': 1533,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Jumping rope',
      'unitId': 1534,
      'unitName': 'secs'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Sprints',
      'unitId': 1711,
      'unitName': 'secs'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Nike+ FuelBand low',
      'unitId': 2553,
      'unitName': 'NikeFuel low'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Nike+ FuelBand low',
      'unitId': 3052,
      'unitName': 'NikeFuel mod-high'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Running with Nike+ iPhone app',
      'unitId': 3042,
      'unitName': 'kms'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Running with Nike+ Android app',
      'unitId': 3043,
      'unitName': 'kms'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Running with Nike+ iPod Nano',
      'unitId': 3044,
      'unitName': 'kms'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Running with Nike+ Sportswatch',
      'unitId': 3045,
      'unitName': 'kms'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Running with Nike+ SportBand',
      'unitId': 3046,
      'unitName': 'kms'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'HIIT',
      'unitId': 3241,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Fitbit active',
      'unitId': 3341,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Cardio',
      'activityCategoryId': 13,
      'activityName': 'Fitbit very active',
      'unitId': 3342,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Squats',
      'unitId': 152,
      'unitName': 'secs'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Squats',
      'unitId': 153,
      'unitName': 'reps'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Abs',
      'unitId': 120,
      'unitName': 'reps'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Abs',
      'unitId': 1504,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Push-ups',
      'unitId': 121,
      'unitName': 'reps'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Pull-ups',
      'unitId': 122,
      'unitName': 'reps'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Pilates',
      'unitId': 123,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Yoga',
      'unitId': 124,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Strength training',
      'unitId': 125,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Strength training',
      'unitId': 126,
      'unitName': 'reps'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Plank',
      'unitId': 151,
      'unitName': 'secs'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Dead lifts',
      'unitId': 1442,
      'unitName': 'reps'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Rows',
      'unitId': 1535,
      'unitName': 'reps'
    }, {
      'activityCategoryDisplayName': 'Strength',
      'activityCategoryId': 14,
      'activityName': 'Lunges',
      'unitId': 1536,
      'unitName': 'reps'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Badminton',
      'unitId': 127,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Baseball',
      'unitId': 128,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Basketball',
      'unitId': 129,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Bowling',
      'unitId': 130,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Curling',
      'unitId': 131,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Mountain sports',
      'unitId': 132,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Golfing - with cart ',
      'unitId': 133,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Golfing - without cart',
      'unitId': 134,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Volleyball',
      'unitId': 135,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Rock climbing',
      'unitId': 136,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Rugby',
      'unitId': 137,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Ultimate frisbee',
      'unitId': 138,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Soccer',
      'unitId': 139,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Hockey',
      'unitId': 140,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Water sports',
      'unitId': 141,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Water sports',
      'unitId': 641,
      'unitName': 'kms'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Martial arts ',
      'unitId': 533,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Football',
      'unitId': 1518,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Tennis',
      'unitId': 1537,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Play',
      'activityCategoryId': 15,
      'activityName': 'Squash',
      'unitId': 1538,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Feel Good',
      'activityCategoryId': 16,
      'activityName': 'Sleep',
      'unitId': 142,
      'unitName': 'hrs'
    }, {
      'activityCategoryDisplayName': 'Feel Good',
      'activityCategoryId': 16,
      'activityName': 'Breathe',
      'unitId': 143,
      'unitName': 'deep breaths'
    }, {
      'activityCategoryDisplayName': 'Feel Good',
      'activityCategoryId': 16,
      'activityName': 'Acts of kindness',
      'unitId': 144,
      'unitName': 'actions'
    }, {
      'activityCategoryDisplayName': 'Feel Good',
      'activityCategoryId': 16,
      'activityName': 'Hobbies',
      'unitId': 145,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Feel Good',
      'activityCategoryId': 16,
      'activityName': 'Stretch',
      'unitId': 146,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Feel Good',
      'activityCategoryId': 16,
      'activityName': 'Meditate',
      'unitId': 147,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Feel Good',
      'activityCategoryId': 16,
      'activityName': 'Volunteer ',
      'unitId': 420,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Feel Good',
      'activityCategoryId': 16,
      'activityName': 'Cell phone off',
      'unitId': 2187,
      'unitName': 'mins'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Fruits/Veggies',
      'unitId': 148,
      'unitName': 'servings'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Water',
      'unitId': 149,
      'unitName': 'glasses'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Wholesome breakfast',
      'unitId': 412,
      'unitName': 'meals'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Wild fish',
      'unitId': 413,
      'unitName': 'servings'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Power lunch - home',
      'unitId': 415,
      'unitName': 'meals'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Light dinner',
      'unitId': 1520,
      'unitName': 'meals'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Grass-fed, grass-finished meat',
      'unitId': 1521,
      'unitName': 'servings'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Free-range poultry',
      'unitId': 1522,
      'unitName': 'servings'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Power lunch',
      'unitId': 2173,
      'unitName': 'meals'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Give it up',
      'unitId': 2174,
      'unitName': 'items'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Bring lunch from home',
      'unitId': 2455,
      'unitName': 'meals'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Portion control',
      'unitId': 2555,
      'unitName': 'meal/snack'
    }, {
      'activityCategoryDisplayName': 'Nutrition',
      'activityCategoryId': 17,
      'activityName': 'Read food labels',
      'unitId': 2556,
      'unitName': 'packaged food'
    }, {
      'activityCategoryDisplayName': 'Lifestyle',
      'activityCategoryId': 18,
      'activityName': 'Weight loss',
      'unitId': 1523,
      'unitName': 'lbs per week'
    }, {
      'activityCategoryDisplayName': 'Lifestyle',
      'activityCategoryId': 18,
      'activityName': 'Reduce smoking',
      'unitId': 1524,
      'unitName': 'beat the urge'
    }, {
      'activityCategoryDisplayName': 'Lifestyle',
      'activityCategoryId': 18,
      'activityName': 'Reduce alcohol',
      'unitId': 1525,
      'unitName': 'beat the urge'
    }, {
      'activityCategoryDisplayName': 'Lifestyle',
      'activityCategoryId': 18,
      'activityName': 'Doctor',
      'unitId': 1526,
      'unitName': 'visits'
    }, {
      'activityCategoryDisplayName': 'Lifestyle',
      'activityCategoryId': 18,
      'activityName': 'Dentist',
      'unitId': 1527,
      'unitName': 'visits'
    }, {
      'activityCategoryDisplayName': 'Lifestyle',
      'activityCategoryId': 18,
      'activityName': 'Health risk assessment',
      'unitId': 1540,
      'unitName': 'report'
    }];

    var readyPromise;

    service.reload = function () {
      var categoriesById = {};

      flatActivities.forEach(function (activity) {
        var category = categoriesById[activity.activityCategoryId];
        if (!category) {
          category = {
            activityCategoryId: activity.activityCategoryId,
            activityCategoryDisplayName: activity.activityCategoryDisplayName,
            activities: []
          };
          categoriesById[activity.activityCategoryId] = category;
        }
        category.activities.push({
          activityName: activity.activityName,
          unitId: activity.unitId,
          unitName: activity.unitName
        });
      });

      service.categories.splice(0, service.categories.length);

      Array.prototype.push.apply(service.categories, _.map(
        _.keys(categoriesById),
        function (id) {
          return categoriesById[id];
        }
      ));

      return util.q.makeResolvedPromise();
    };

    readyPromise = service.reload();

    service.whenReady = function () {
      return readyPromise;
    };

    return service;
  }
]);