/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('LoginCtrl',["$scope", "RestService", "$state", "$rootScope","$http",
    function ($scope, RestService, $state, $rootScope, $http) {



        if (RestService.getCookie('csrftoken') == null) {
            RestService.fetchObjectByUrl('http://www.dir.com/api-auth/login/?next=/')
                .then(
                    function (data) {
                        console.log('get get ' + RestService.getCookie('csrftoken'));
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );

        } else{
            console.log(RestService.getCookie('csrftoken'));
        }


        $scope.loginModal = function (username, pass) {
            RestService.login(username,pass)
                .then(
                    function (data) {
                        console.log(data[0]);
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };
    }]);