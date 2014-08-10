angular.module('OnTheGrow.services', [])
  .factory('listsService', ['server', '$q', '$log',
   function(server, $q, $log) {
      var service = {};
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

      service.fetchProduceList = function() {
        return server.query().$promise
          .then(function(allUserObj) {
            $log.log('Server returned allUserObj'); 
            $log.log(allUserObj)
            // service.userList = allUserObj;
            // var produceArray = [];
            // angular.forEach(allUserObj, function(eachUserObj) {
            //   angular.forEach(eachUserObj.listings, function(eachProduceObj) {
            //     produceArray.push(eachProduceObj);
            //   })
            // })
            // service.produceList = produceArray;
            service.produceList = allUserObj;
            return service.produceList;
        });
      }
      return service;
  }])
