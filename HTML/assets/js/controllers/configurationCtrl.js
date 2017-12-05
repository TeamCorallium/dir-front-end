app.controller('ConfigurationsCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert", "$translate", "$location", "$anchorScroll",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert, $translate, $location, $anchorScroll) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", {
            path: '/'
        });

        $scope.switchProfile = true;
        $scope.switchEmail = true;
        $scope.switchShowEmail = true;

        $scope.getCount = function() {
            RestService.fetchNotificationUnreaded()
                .then(
                    function(data) {
                        var count = data;
                        
                        if (count > 9) {
                            $rootScope.notificationCount = '10';
                        } else {
                            $rootScope.notificationCount = count;
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        if ($cookies.get('username')) {
            $scope.getCount();
        }

        $scope.jumpToLocation = function(key) {
            $location.hash(key);
            $anchorScroll();
        }

        $scope.switchEmailChange = function() {
            console.log($scope.switchEmail + " switchEmail");
        };

        $scope.switchProfileChange = function() {
            console.log($scope.switchProfile + " switchProfile");
        };

        $scope.switchShowEmailChange = function() {
            console.log($scope.switchShowEmail + " switchShowEmail");
        };
    }
]);