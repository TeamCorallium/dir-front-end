app.controller('UserPrivateCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert", "$translate", "filterFilter",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert, $translate, filterFilter) {

        $rootScope.OptionsEdit = true;
        $rootScope.notificationCount = 0;
        $cookies.remove("exploreUser", {
            path: '/'
        });
    }
]);