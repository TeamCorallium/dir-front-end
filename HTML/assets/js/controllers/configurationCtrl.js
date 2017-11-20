/**
 * Created by Ale on 9/14/2017.
 */

'use strict';

app.controller('ConfigurationsCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert", "$translate",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert, $translate) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", {
            path: '/'
        });

        $scope.switchProfile = true;
        $scope.switchEmail = true;
        $scope.switchShowEmail = true;

    }
]);