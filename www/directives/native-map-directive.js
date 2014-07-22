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
                                // add current location marker
                        $rootScope.map.addMarker({
                            'position': new plugin.google.maps.LatLng(43.700, -79.4000),
                            'title': 'Me',
                            'icon': {
                                'url': 'www/assets/img/marker_blue.png',
                                'size': {
                                    'width': 40,
                                    'height': 40
                                }
                            },
                            'draggable': true
                        });

                        $rootScope.map.moveCamera({
                              'target': new plugin.google.maps.LatLng(43.700, -79.4000),
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
                    }, 1000);
                }
            };
        }
    };
});
