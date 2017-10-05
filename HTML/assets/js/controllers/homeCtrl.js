/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('HomeCtrl',["$scope", "$state", "$cookies",
    function ($scope, $state, $cookies) {

        $rootScope.viewEditProfile = true;
        $rootScope.viewProfile = true;

    }]);