/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('LoginCtrl',["$scope", "RestService", "$state", "$rootScope","$http",
    function ($scope, RestService, $state, $rootScope, $http) {

        $scope.connected = false;

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
            RestService.login(username,pass);
        };

        $rootScope.$on('connected',function (event, data) {
            console.log('se conecto');
            $scope.connected = true;
            $('#myModal').modal('hide');
            $rootScope.userdata.username = data;
            console.log(data + " data " + $rootScope.userdata.username);
        });
    }]);