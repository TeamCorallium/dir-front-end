/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AdminViewCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl",
    function ($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl) {

        $scope.stuff  = {
            color: '',
            size: '',
            code: '',
            pin: ''
        };

        $scope.addStuff = function() {
            console.log($scope.stuff.color);
            console.log($scope.stuff.size);
            console.log($scope.stuff.code);
            console.log($scope.stuff.pin);
        };

    }]);