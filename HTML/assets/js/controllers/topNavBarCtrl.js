/**
 * Created by Ale on 9/14/2017.
 */

'use strict';

app.controller('TopNavBarCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert", "$translate", "filterFilter",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert, $translate, filterFilter) {

        $rootScope.notificationCount = 0;
    }
]);