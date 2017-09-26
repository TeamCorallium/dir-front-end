/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('LoginCtrl',["$scope", "RestService", "$state", "$rootScope",'$cookies',
    function ($scope, RestService, $state, $rootScope, $cookies) {

        if (RestService.getCookie('csrftoken') == null) {
            RestService.fetchObjectByUrl('http://10.58.20.225/api-auth/login/?next=/')
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
            $('#errorBox').hide();
            $('#myModal').modal('hide');
            $state.go('profile');
        });

        $scope.logout = function () {
            $cookies.remove("sessionid",{path: '/'});
            $cookies.remove("username",{path: '/'});
            $rootScope.$broadcast('logout');
            $state.go('home');
        };

        $rootScope.$on('wrongLogin',function (event, data) {
            console.log('error al conectarse');
            $('#errorBox').show();
        });
    }]);