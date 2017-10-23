/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('LoginCtrl',["$scope", "RestService", "$state", "$rootScope",'$cookies',
    function ($scope, RestService, $state, $rootScope, $cookies) {        

        if (RestService.getCookie('csrftoken') == null) {
            RestService.fetchObjectByUrl(RestService.loginNext)
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
            $('#errorBoxHome').hide();
            $('#myModal').modal('hide');
            $('#myModalLoginHome').modal('hide');
            $state.go('profile');
        });

        $scope.logout = function () {
            $cookies.remove("sessionid",{path: '/'});
            $cookies.remove("username",{path: '/'});
            $rootScope.$broadcast('logout');
            $state.go('home');
        };

        $rootScope.$on('wrongLogin',function (event, data) {
            // $('#errorBoxHome').show();
            // $('#errorBox').show();            
            toaster.pop('error', 'Error', 'Wrong user or password.');
        });
    }]);