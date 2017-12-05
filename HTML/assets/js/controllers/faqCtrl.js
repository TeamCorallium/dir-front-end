app.controller('FAQCtrl', ["$scope", "RestService", "$state", "$rootScope", '$cookies',
    function($scope, RestService, $state, $rootScope, $cookies) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", { path: '/' });

        $scope.getCount = function() {
            RestService.fetchNotificationUnreaded()
                .then(
                    function(data) {
                        var count = data;
                        console.log(data + " " + count + " data-count");
                        if (count > 9) {
                            $rootScope.notificationCount = '9+';
                            console.log($rootScope.notificationCount + " >9");
                        } else {
                            $rootScope.notificationCount = count;
                            console.log($rootScope.notificationCount + " <=9");
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

    }
]);