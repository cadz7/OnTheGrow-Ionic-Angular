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

    var board1 = [
      {
        "leaderboardNameDisplay": "Top 5 in Pronvice",
        "items": [
          {
            "rank": 1,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 117,
            "name": "Huff",
            "isViewer": false,
            "score": 1397,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 2,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 105,
            "name": "Harper",
            "isViewer": true,
            "score": 1328,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 3,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 147,
            "name": "Macias",
            "isViewer": false,
            "score": 1671,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 1,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 13,
            "name": "Nicholson",
            "isViewer": false,
            "score": 634,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 4,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 75,
            "name": "Mcmillan",
            "isViewer": false,
            "score": 589,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 in Company",
        "items": [
          {
            "rank": 4,
            "avatarUrl": "img/user/ford.png",
            "entityId": 32,
            "name": "Dudley",
            "isViewer": true,
            "score": 760,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 5,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 85,
            "name": "Acevedo",
            "isViewer": false,
            "score": 1089,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 5,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 29,
            "name": "Chandler",
            "isViewer": false,
            "score": 1011,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 3,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 26,
            "name": "Franks",
            "isViewer": false,
            "score": 1479,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 4,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 25,
            "name": "Workman",
            "isViewer": false,
            "score": 1527,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 in Department",
        "items": [
          {
            "rank": 5,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 110,
            "name": "Byrd",
            "isViewer": false,
            "score": 1023,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 1,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 54,
            "name": "Green",
            "isViewer": false,
            "score": 1460,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 1,
            "avatarUrl": "img/user/ford.png",
            "entityId": 74,
            "name": "Whitfield",
            "isViewer": false,
            "score": 1667,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 2,
            "avatarUrl": "img/user/ford.png",
            "entityId": 98,
            "name": "Holt",
            "isViewer": false,
            "score": 474,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 4,
            "avatarUrl": "img/user/ford.png",
            "entityId": 49,
            "name": "Stephenson",
            "isViewer": true,
            "score": 494,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 in Group",
        "items": [
          {
            "rank": 3,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 140,
            "name": "Lambert",
            "isViewer": false,
            "score": 1355,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 3,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 133,
            "name": "York",
            "isViewer": true,
            "score": 1324,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 4,
            "avatarUrl": "img/user/ford.png",
            "entityId": 62,
            "name": "Schroeder",
            "isViewer": false,
            "score": 1087,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 4,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 93,
            "name": "Burgess",
            "isViewer": false,
            "score": 890,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 3,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 110,
            "name": "Steele",
            "isViewer": false,
            "score": 658,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          }
        ]
      }
    ];

    var board2 = [
      {
        "leaderboardNameDisplay": "Top 5 in Company",
        "items": [
          {
            "rank": 4,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 145,
            "name": "Peterson",
            "isViewer": false,
            "score": 1454,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 2,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 101,
            "name": "Wade",
            "isViewer": false,
            "score": 1649,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 1,
            "avatarUrl": "img/user/ford.png",
            "entityId": 48,
            "name": "Walters",
            "isViewer": false,
            "score": 1277,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 1,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 89,
            "name": "Cox",
            "isViewer": true,
            "score": 1353,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 2,
            "avatarUrl": "img/user/ford.png",
            "entityId": 133,
            "name": "Simmons",
            "isViewer": false,
            "score": 1237,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 In Group",
        "items": [
          {
            "rank": 5,
            "avatarUrl": "img/user/ford.png",
            "entityId": 99,
            "name": "Pollard",
            "isViewer": false,
            "score": 1225,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 2,
            "avatarUrl": "img/user/ford.png",
            "entityId": 48,
            "name": "Cole",
            "isViewer": false,
            "score": 820,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 4,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 37,
            "name": "Rosario",
            "isViewer": true,
            "score": 661,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 3,
            "avatarUrl": "img/user/ford.png",
            "entityId": 53,
            "name": "Stout",
            "isViewer": false,
            "score": 938,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 4,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 103,
            "name": "Blackwell",
            "isViewer": false,
            "score": 1194,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 in Department",
        "items": [
          {
            "rank": 2,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 103,
            "name": "Curtis",
            "isViewer": false,
            "score": 831,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 5,
            "avatarUrl": "img/user/ford.png",
            "entityId": 19,
            "name": "Shelton",
            "isViewer": false,
            "score": 1016,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 1,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 84,
            "name": "Hamilton",
            "isViewer": true,
            "score": 1189,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 4,
            "avatarUrl": "img/user/ford.png",
            "entityId": 21,
            "name": "Perkins",
            "isViewer": false,
            "score": 1743,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 3,
            "avatarUrl": "img/user/arthur.png",
            "entityId": 56,
            "name": "Ball",
            "isViewer": false,
            "score": 814,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 in Pronvice",
        "items": [
          {
            "rank": 2,
            "avatarUrl": "img/user/ford.png",
            "entityId": 100,
            "name": "Bond",
            "isViewer": false,
            "score": 1622,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 2,
            "avatarUrl": "img/user/ford.png",
            "entityId": 104,
            "name": "Ortiz",
            "isViewer": false,
            "score": 1464,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 2,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 25,
            "name": "Mack",
            "isViewer": false,
            "score": 1294,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 2,
            "avatarUrl": "img/user/ford.png",
            "entityId": 105,
            "name": "Daugherty",
            "isViewer": false,
            "score": 1766,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 3,
            "avatarUrl": "img/user/fenchurch.png",
            "entityId": 39,
            "name": "Hall",
            "isViewer": true,
            "score": 581,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          }
        ]
      }
    ];

    service.loadPeriods = function() {
      return util.q.makeResolvedPromise();
    };

    service.getBoards = function(params) {
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