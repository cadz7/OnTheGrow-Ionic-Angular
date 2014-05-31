angular.module('sproutApp.data.leaderboards', [
  'sproutApp.user',
  'sproutApp.util'
])

.factory('leaderboards', ['$q', 'user', 'util','leaderboardsMockServer','API_CONSTANTS',
  function ($q, user, util, server, API_CONSTANTS) {
    var service = {};    

    //
    /*
    * Get a collection of leaderBoards from the server
    * 
    * @param {object} params is an object with these properites
    *                      periodId
    *                      userFilterId
    *                      activityFilterId
    *
    * @return {promise}   a $q promise containing the leaderboards
    */
    service.getBoards = function(params) {
      return server.get(API_CONSTANTS.leaderboardsEndpoint, params);
    };

    return service;
  }
])
.factory('leaderboardsMockServer',['$q','util',function($q,util){
    var board1 = [
      {
        "leaderboardNameDisplay": "Top 5 in Pronvice",
        "items": [
          {
            "rank": 1,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 117,
            "name": "Huff",
            "isViewer": false,
            "score": 1397,
            "detailsDisplay": {
              "template": "{department.name}",
              "values": {
                "department": {
                  name : "Sales"
                }
              }
            }
          },
          {
            "rank": 2,
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/ford.png",
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
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/ford.png",
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
            "avatarURL": "img/user/ford.png",
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
            "avatarURL": "img/user/ford.png",
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
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/ford.png",
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
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/arthur.png",
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
            "rank": 3,
            "avatarURL": "img/user/fenchurch.png",
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
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 101,
            "name": "Wade",
            "isViewer": false,
            "score": 1499,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/ford.png",
            "entityId": 48,
            "name": "Walters",
            "isViewer": false,
            "score": 1577,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 89,
            "name": "Cox",
            "isViewer": true,
            "score": 1300,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 5,
            "avatarURL": "img/user/ford.png",
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
            "rank": 6,
            "avatarURL": "img/user/ford.png",
            "entityId": 99,
            "name": "Pollard",
            "isViewer": false,
            "score": 12,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 2,
            "avatarURL": "img/user/ford.png",
            "entityId": 48,
            "name": "Cole",
            "isViewer": false,
            "score": 1820,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/ford.png",
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
            "rank": 5,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 103,
            "name": "Blackwell",
            "isViewer": false,
            "score": 114,
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
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/ford.png",
            "entityId": 19,
            "name": "Shelton",
            "isViewer": false,
            "score": 106,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/ford.png",
            "entityId": 21,
            "name": "Perkins",
            "isViewer": false,
            "score": 173,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 3,
            "avatarURL": "img/user/arthur.png",
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
            "avatarURL": "img/user/ford.png",
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
            "rank": 3,
            "avatarURL": "img/user/ford.png",
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
            "rank": 4,
            "avatarURL": "img/user/fenchurch.png",
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
            "rank": 5,
            "avatarURL": "img/user/ford.png",
            "entityId": 105,
            "name": "Daugherty",
            "isViewer": false,
            "score": 766,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 6,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 39,
            "name": "Hall",
            "isViewer": true,
            "score": 1,
            "detailsDisplay": {
              "template": "{department.name}",
              "values": {
                "department": {name:"Sales"}
              }
            }
          }
        ]
      }
    ];

    var board3 = [
      {
        "leaderboardNameDisplay": "Top 5 in Company",
        "items": [
          {
            "rank": 1,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 106,
            "name": "Bryant",
            "isViewer": false,
            "score": 884,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 50,
            "name": "Merritt",
            "isViewer": true,
            "score": 1480,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 70,
            "name": "Wheeler",
            "isViewer": false,
            "score": 434,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/arthur.png",
            "entityId": 112,
            "name": "Livingston",
            "isViewer": false,
            "score": 543,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/ford.png",
            "entityId": 25,
            "name": "Soto",
            "isViewer": false,
            "score": 1052,
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
        "leaderboardNameDisplay": "Top 5 In Group",
        "items": [
          {
            "rank": 4,
            "avatarURL": "img/user/ford.png",
            "entityId": 82,
            "name": "Atkins",
            "isViewer": true,
            "score": 786,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 3,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 74,
            "name": "Norton",
            "isViewer": false,
            "score": 562,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 139,
            "name": "Holman",
            "isViewer": false,
            "score": 1293,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 2,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 121,
            "name": "Mccall",
            "isViewer": false,
            "score": 910,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 5,
            "avatarURL": "img/user/ford.png",
            "entityId": 141,
            "name": "Vaughan",
            "isViewer": false,
            "score": 597,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 in Pronvice",
        "items": [
          {
            "rank": 5,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 109,
            "name": "Holden",
            "isViewer": false,
            "score": 1195,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 2,
            "avatarURL": "img/user/arthur.png",
            "entityId": 129,
            "name": "Lynch",
            "isViewer": false,
            "score": 1487,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/arthur.png",
            "entityId": 45,
            "name": "Hammond",
            "isViewer": false,
            "score": 1471,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/ford.png",
            "entityId": 28,
            "name": "Ramos",
            "isViewer": false,
            "score": 541,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/arthur.png",
            "entityId": 23,
            "name": "Dunn",
            "isViewer": false,
            "score": 879,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 in Company",
        "items": [
          {
            "rank": 3,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 52,
            "name": "Macdonald",
            "isViewer": true,
            "score": 1379,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 34,
            "name": "Kaufman",
            "isViewer": false,
            "score": 980,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/arthur.png",
            "entityId": 70,
            "name": "Scott",
            "isViewer": false,
            "score": 1526,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 3,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 78,
            "name": "Finley",
            "isViewer": false,
            "score": 1699,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 5,
            "avatarURL": "img/user/arthur.png",
            "entityId": 124,
            "name": "Shelton",
            "isViewer": false,
            "score": 1314,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          }
        ]
      }
    ];

    var board4 = [
      {
        "leaderboardNameDisplay": "Top 5 In Group",
        "items": [
          {
            "rank": 4,
            "avatarURL": "img/user/ford.png",
            "entityId": 71,
            "name": "Shannon",
            "isViewer": false,
            "score": 489,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 3,
            "avatarURL": "img/user/ford.png",
            "entityId": 149,
            "name": "Joyner",
            "isViewer": true,
            "score": 953,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 5,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 45,
            "name": "Wheeler",
            "isViewer": false,
            "score": 1332,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 2,
            "avatarURL": "img/user/arthur.png",
            "entityId": 130,
            "name": "Stephenson",
            "isViewer": false,
            "score": 1697,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 40,
            "name": "Tucker",
            "isViewer": false,
            "score": 910,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          }
        ]
      },
      {
        "leaderboardNameDisplay": "Top 5 in Pronvice",
        "items": [
          {
            "rank": 1,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 138,
            "name": "Pruitt",
            "isViewer": false,
            "score": 1657,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 5,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 61,
            "name": "Giles",
            "isViewer": false,
            "score": 1299,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/ford.png",
            "entityId": 134,
            "name": "Rodriquez",
            "isViewer": false,
            "score": 1527,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/arthur.png",
            "entityId": 74,
            "name": "Terry",
            "isViewer": true,
            "score": 1301,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 2,
            "avatarURL": "img/user/arthur.png",
            "entityId": 80,
            "name": "Lyons",
            "isViewer": false,
            "score": 1436,
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
        "leaderboardNameDisplay": "Top 5 In Company",
        "items": [
          {
            "rank": 3,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 89,
            "name": "Marsh",
            "isViewer": true,
            "score": 1094,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/arthur.png",
            "entityId": 12,
            "name": "Hoffman",
            "isViewer": false,
            "score": 1026,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/arthur.png",
            "entityId": 108,
            "name": "Powell",
            "isViewer": false,
            "score": 519,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/arthur.png",
            "entityId": 141,
            "name": "Hayes",
            "isViewer": false,
            "score": 529,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Sales"
              }
            }
          },
          {
            "rank": 1,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 23,
            "name": "Beach",
            "isViewer": false,
            "score": 1015,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
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
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 42,
            "name": "Hewitt",
            "isViewer": false,
            "score": 964,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "PR"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/fenchurch.png",
            "entityId": 104,
            "name": "Swanson",
            "isViewer": false,
            "score": 475,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 2,
            "avatarURL": "img/user/arthur.png",
            "entityId": 148,
            "name": "Gay",
            "isViewer": false,
            "score": 1760,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "HR"
              }
            }
          },
          {
            "rank": 4,
            "avatarURL": "img/user/arthur.png",
            "entityId": 93,
            "name": "Frank",
            "isViewer": true,
            "score": 1623,
            "detailsDisplay": {
              "template": "{department}",
              "values": {
                "department": "Finances"
              }
            }
          },
          {
            "rank": 2,
            "avatarURL": "img/user/ford.png",
            "entityId": 82,
            "name": "Avery",
            "isViewer": false,
            "score": 759,
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

  return {
    get : function(url,params){
      var board;
      if (params.periodId===101 && params.userFilterId === 13 && params.activityFilterId===301) {
        board = board1;
      } else if(params.periodId === 102){
        //Selecting period "this month"
        board = board3;
      }else if(params.activityFilterId === 106){
        //Should fire for at least one activity change - Cardio: Cycling
        board = board4;
      }else {
        board = board2;
      }
      return util.q.makeResolvedPromise(_.cloneDeep(board));

    }
  }
}])