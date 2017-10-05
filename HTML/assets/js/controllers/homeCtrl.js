/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('HomeCtrl',["$scope", "$state", "$rootScope",
    function ($scope, $state, $rootScope) {

        $rootScope.viewEditProfile = true;
        $rootScope.viewProfile = true;

    }]);