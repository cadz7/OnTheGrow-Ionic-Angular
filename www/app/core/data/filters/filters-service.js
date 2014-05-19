angular.module('sproutApp.data.filters', [
  'sproutApp.user',
  'sproutApp.util'
])

.factory('filters', ['$q', 'user', 'util',
  function ($q, user, util) {
    var service = {};

    service.streamItemFilters = [
      {
        filterId: 101,
        displayName: 'Fun items',
        filterType: 'stream_items'
      }, {
        filterId: 102,
        displayName: 'Boring items',
        filterType: 'stream_items'
      }
    ];

    service.userFilters = [
      {
        filterId: 201,
        displayName: 'Cool people',
        filterType: 'users'
      }, {
        filterId: 202,
        displayName: 'Square people',
        filterType: 'users'
      }
    ];

    service.activityFilters = [
      {
        filterId: 301,
        displayName: 'Exercise',
        filterType: 'activities'
      }, {
        filterId: 302,
        displayName: 'Nutrition',
        filterType: 'activities'
      }
    ];

    return service;
  }
]);