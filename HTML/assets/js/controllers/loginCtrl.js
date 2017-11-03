/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('LoginCtrl', ["$scope", "RestService", "$state", "$rootScope", "$cookies", "growl",
    function ($scope, RestService, $state, $rootScope, $cookies, growl) {

        $scope.usernameHome  = '';
        $scope.pwdHome = '';

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

        } else {
            console.log(RestService.getCookie('csrftoken'));
        }

        $scope.loginModal = function (username, pass) {
            RestService.login(username, pass);
        };

        $rootScope.$on('connected', function (event, data) {
            $('#errorBox').hide();
            $('#errorBoxHome').hide();
            $('#myModal').modal('hide');
            $('#myModalLoginHome').modal('hide');
            $state.go('profile');
        });

        $scope.logout = function () {
            $cookies.remove("sessionid", { path: '/' });
            $cookies.remove("username", { path: '/' });
            $rootScope.$broadcast('logout');
            $state.go('home');
        };

        $rootScope.$on('wrongLogin', function (event, data) {
            $('#errorBoxHome').show();
            $('#errorBox').show();
        });

        $rootScope.$on('forbidden', function (event, data) {
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

            } else {
                console.log(RestService.getCookie('csrftoken'));
            }

            growl.error("We detected some problems, please try again", {title: 'Logins Problems'});
        });

        $rootScope.$on('LoginNetworkConnectionError', function (event, data) {            
            growl.error("Server Not Found. Check your internet connection.", { title: 'Network Connection' });
        });

        $scope.runScript = function(e) {
            console.log(e + " event");
            if (e.keyCode == 13) {
                $scope.loginModal($scope.usernameHome,$scope.pwdHome)
            }
        }
    }]);