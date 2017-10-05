/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('RegistrationCtrl',["$scope", "RestService", "$state", "$rootScope",'$cookies',
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

        $scope.registerModal = function (username, password, passAgain, email, pin) {
            if (password === passAgain) {
                RestService.register(username, password, email, pin);
            } else {
                $('#errorRegisterBox').show();
            }
        };

        $scope.registerModalHome = function (email, username, password, passAgain) {
            if (password === passAgain) {
                RestService.register(username, password, email, "");
            } else {
                $('#errorRegisterBoxHome').show();
            }
        };

        $rootScope.$on('register',function (event, data) {
            $('#myModal').modal('hide');
            $('#myModalRegisterHome').modal('hide');
            $('#errorRegisterBox').hide();
            RestService.login(data.username,data.password);
        });

        $rootScope.$on('wrongRegister', function (event, data) {
            $('#errorRegisterBox').show();
            $('#errorRegisterBoxHome').show();
        });
    }]);