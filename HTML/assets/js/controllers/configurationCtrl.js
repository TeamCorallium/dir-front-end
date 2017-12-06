app.controller('ConfigurationsCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert", "$translate", "$location", "$anchorScroll",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert, $translate, $location, $anchorScroll) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", {
            path: '/'
        });

        console.log("show here " + $cookies.get('configVisible') + " " + $cookies.get('configEmailVisible') + " " + $cookies.get('configReceiveEmails'));

        $scope.switchProfile = $cookies.get('configVisible');
        $scope.switchEmail = $cookies.get('configEmailVisible');
        $scope.switchShowEmail = $cookies.get('configReceiveEmails');

        var flag = ''; 

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
            flag = 'visible';
            RestService.updateConfiguration($scope.switchProfile, $scope.switchEmail, $scope.switchShowEmail)
        };

        $scope.switchProfileChange = function() {
            flag = 'profile';
            RestService.updateConfiguration($scope.switchProfile, $scope.switchEmail, $scope.switchShowEmail)
        };

        $scope.switchShowEmailChange = function() {
            flag = 'email';
            RestService.updateConfiguration($scope.switchProfile, $scope.switchEmail, $scope.switchShowEmail)
        };

        $rootScope.$on('wrongConfig', function(event, data) {
            if (flag = 'visible') {
                $scope.switchProfile != $scope.switchProfile;
            } else if ( flag = 'profile') {
                $scope.switchEmail != $scope.switchEmaill;
            } else {
                $scope.switchShowEmail != $scope.switchShowEmail;
            }
        });
    }
]);