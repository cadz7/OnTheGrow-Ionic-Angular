angular.module('sproutApp.data.leaderboards', [
  'sproutApp.user',
  'sproutApp.util'
])

.factory('leaderboards', ['$q', 'user', 'util',
  function ($q, user, util) {
    var service = {};

    service.periods = [
      {
        timePeriodId: 101,
        timePeriodNameDisplay: 'This week'
      }, {
        timePeriodId: 102,
        timePeriodNameDisplay: 'This month'
      }, {
        timePeriodId: 103,
        timePeriodNameDisplay: 'This quarter'
      }
    ];

    var board1 = {
      leaderboardNameDisplay: 'Company',
      contestantLabel: 'Department',
      items: [
        {
          entityId : 1001,
          rank: 1,
          name: 'Legal',
          detailsDisplay: {
            template: '{number} of people',
            values: {
              number: 42
            }
          },
          score: 1200,
          isViewer: false
        },
        {
          entityId : 1002,
          rank: 2,
          name: 'Marketing',
          detailsDisplay: {
            template: '{number} of people',
            values: {
              number: 17
            }
          },
          score: 1100,
          isViewer: true
        },
        {
          entityId : 1003,
          rank: 2,
          name: 'Vogon Poetry',
          detailsDisplay: {
            template: '{number} of people',
            values: {
              number: 19
            }
          },
          score: 1000,
          isViewer: false
        }
      ]
    };

    var board2 = {
      leaderboardNameDisplay: 'Foo',
      contestantLabel: 'Species',
      items: [
        {
          entityId : 2001,
          rank: 1,
          name: 'Dolphins',
          detailsDisplay: {
            template: '{number} cm',
            values: {
              number: 242
            }
          },
          score: 1200,
          isViewer: false
        },
        {
          entityId : 2002,
          rank: 2,
          name: 'Vogons',
          detailsDisplay: {
            template: '{number} cm',
            values: {
              number: 190
            }
          },
          score: 1100,
          isViewer: true
        },
        {
          entityId : 2003,
          rank: 2,
          name: 'Hooloovoo',
          detailsDisplay: {
            template: '{number} cm',
            values: {
              number: 0
            }
          },
          score: 1000,
          isViewer: false
        }
      ]
    };

    service.loadPeriods = function() {
      return util.q.makeResolvedPromise();
    };

    service.getBoard = function(params) {
      var board;
      if (params.periodId===101 && params.userFilterId === 201 && params.activityFilterId===301) {
        board = board1;
      } else {
        board = board2;
      }
      return util.q.makeResolvedPromise(_.cloneDeep(board));
    };

    return service;
  }
]);