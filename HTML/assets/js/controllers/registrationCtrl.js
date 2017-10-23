/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('RegistrationCtrl',["$scope", "RestService", "$state", "$rootScope",'$cookies',
    function ($scope, RestService, $state, $rootScope, $cookies) {

        $scope.errorMessage = '';

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
            if (username != '' && password != '' && passAgain != '' && email != '' && pin != ''){
                if (password === passAgain) {
                    RestService.register(username, password, email, pin);
                } else {
                    $scope.errorMessage = 'Passwords do not match. Sorry, try again';
                    $('#errorRegisterBox').show();
                }
            } else {
                $scope.errorMessage = 'Cannot exist empty fields';
                $('#errorRegisterBox').show();
            }
            
        };

        $scope.registerModalHome = function (email, username, password, passAgain) {
            if (username != '' && password != '' && passAgain != '' && email != ''){
                if (password === passAgain) {
                    RestService.register(username, password, email, "");
                } else {
                    $('#errorRegisterBoxHome').show();
                }
            } else {
                // throw toaster with message empty camps
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