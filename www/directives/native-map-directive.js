angular.module('OnTheGrow.directives', [])
.directive('map', function($rootScope, $timeout, $ionicLoading) {
    return {
        compile: function(tElem,attrs) {
            return function(scope,elem,attrs) {
                if ($rootScope.loaded)
                    $rootScope.map.setVisible(true);
                else {
                    $ionicLoading.show({
                        template: 'Loading Map...<i class="icon ion-loading-b"></i>'
                    });

                    $timeout(function() {
                        GeoLocation.getCurrentPosition(function (position) {
                            // add courts markers
                            Courts.getAll(position.coords.latitude,position.coords.longitude, function(data) {
                                $rootScope.courtsData = data;
                                for(court in data) {
                                    $rootScope.map.addMarker({
                                      'position': new plugin.google.maps.LatLng(data[court].latitude,data[court].longitude),
                                      'title': data[court].name
                                    }, function(marker) {
                                        marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
                                        // change this alert to opening a page
                                        alert('I got clicked');
                                        });
                                    });
                                }

                                // move camera to current position
                                $rootScope.map.moveCamera({
                                      'target': new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude),
                                      'zoom': 13,
                                      'tilt': 0
                                    });

                                var div = document.getElementById("map_canvas");

                                $rootScope.map.setDiv(div);
                                //$rootScope.setVisible(true);

                                $ionicLoading.hide();

                                $rootScope.loaded = true;

                                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                                    $rootScope.map.setVisible(false);
                                });
                            });
                        });
                    }, 1000);
                }
            };
        }
    };
});
