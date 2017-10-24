/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ContactUsCtrl', ["$scope", "$state", "$rootScope", "RestService", "$cookies",
    function ($scope, $state, $rootScope, RestService, $cookies) {

        $scope.message = {
            email: '',
            subject: '',
            body: ''
        };

        var getUser = function (username) {
            RestService.fetchUserByUser(username)
                .then(
                function (data) {
                    data = data.results;
                    $scope.message.email = data[0].email;
                },
                function (errResponse) {
                    console.log(errResponse);
                }
                );
        };

        if ($cookies.get('username')) {
            getUser($cookies.get('username'));
        }

        $scope.sendMessage = function () {
            console.log(message.email + " " + message.subject + " " + message.body);
        };
    }]);