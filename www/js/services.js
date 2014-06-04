// ----------------------------------------
// The List Service
// ----------------------------------------
angular.module('swipeToDo.services', [])
  .factory('listsService', [

    function() {

      var service = {};

      service.lists = [{
        title: 'Car cleaning',
        items: toDos,
        id: 0
      }, {
        title: 'Maintain Lawn',
        items: toBuy,
        id: 1
      }, {
        title: 'Door to door campaigning',
        items: reminders,
        id: 2
      }];

      service.add = function(list) {
        service.lists.push(list);
      };

      service.get = function(id) {
        if (!id)
          return service.lists;
        else {
          id = parseInt(id);
          for (var i = service.lists.length - 1; i >= 0; i--) {
            if (service.lists[i].id === id) {
              return service.lists[i];
            }
          }
        }
      };

      service.find = function(query) {
        var items = [];
        angular.forEach(service.lists, function(list) {
          Array.prototype.push.apply(items, list.items);
        });
        return _.filter(items, function(item) {
          return item.title.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      };

      return service;
    }
  ]).

  factory("PostsServices", ["$firebase","$http", function($firebase,$http) {
    var ref = new Firebase("https://glowing-fire-1039.firebaseio.com/");
    var posts = [];
    ref.on("value", function(snapshot) {
      posts = snapshot.val();
      console.log(posts);
    });
    return {
      getPosts: function() {
        return posts;
      },
      addPost: function(title, post) {
        ref.child(title).set(post);
      },
      addressToXY: function(address,callback) {
        $http({method: 'GET', url: 'http://maps.google.com/maps/api/geocode/json?address='+
        address+'&sensor=false'}).
        success(callback);
      },
      getLocation: function () {
        var onSuccess = function(position) {
          alert('Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');
          $scope.position = position;
          };

          // onError Callback receives a PositionError object
          //
          function onError(error) {
              alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');
          }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }
    };
  }]);


// ----------------------------------------
// Mock Data
// ----------------------------------------
// Things to do
var toDos = [{
  title: 'Part time car cleaning job available for interested students. Pay is $11/hr and hours are flexible. Please contact for more info.',
  pay: '$11/hr',
  address: '69 Denison Avenue, Toronto',
  done: false,
  id: 0
}];

// Reminder
var reminders = [{
  title: 'Part time car cleaning job available for interested students. Pay is $11/hr and hours are flexible. Please contact for more info.',
  pay: '$13/hr',
  address: '91 King Street West, Toronto',
  done: false,
  id: 0
}];


// Things to buy
var toBuy = [{
  title: 'Part time car cleaning job available for interested students. Pay is $11/hr and hours are flexible. Please contact for more info.',
  pay: '$15/hr',
  address: '205 Augusta Avenue, Toronto',
  done: false,
  id: 0

}];
