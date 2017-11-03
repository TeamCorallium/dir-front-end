/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('RegistrationCtrl', ["$scope", "RestService", "$state", "$rootScope", "$cookies", "growl",
    function ($scope, RestService, $state, $rootScope, $cookies, growl) {

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

        } else {
            console.log(RestService.getCookie('csrftoken'));
        }

        $scope.registerModal = function (email, username, password, passAgain, pin) {
            $('#RegisterWrongUserPassword').hide();
            $('#RegisterWrongUserPasswordHome').hide();

            if (username != '' && password != '' && passAgain != '' && email != '' && pin != '') {
                if (password === passAgain) {
                    RestService.register(username, password, email, pin);
                } else {
                    growl.error("Sorry try again", { title: 'Wrong User or Password' });
                }
            } else {
                growl.error("Sorry all fields are required", { title: 'Empty fields' });
            }
        };

        $scope.registerModalHome = function (email, username, password, passAgain) {
            $('#RegisterWrongUserPassword').hide();
            $('#RegisterWrongUserPasswordHome').hide();

            if (username != '' && password != '' && passAgain != '' && email != '') {
                if (password === passAgain) {
                    RestService.register(username, password, email);
                } else {
                    growl.error("Sorry try again", { title: 'Wrong User or Password' });
                }
            } else {
                growl.error("Sorry all fields are required", { title: 'Empty fields' });
            }
        };

        $rootScope.$on('register', function (event, data) {
            $('#myModal').modal('hide');
            $('#myModalRegisterHome').modal('hide');
            $('#RegisterWrongUserPassword').hide();
            $('#RegisterWrongUserPasswordHome').hide();
            RestService.login(data.username, data.password);
        });

        $rootScope.$on('wrongRegister', function (event, data) {
            $('#RegisterWrongUserPassword').show();
            $('#RegisterWrongUserPasswordHome').show();
        });

        $rootScope.$on('withoutNetworkConnection', function (event, data) {
            $('#RegisterWrongUserPassword').hide();
            $('#RegisterWrongUserPasswordHome').hide();
            growl.error("Server Not Found. Check your internet connection.", { title: 'Network Connection' });
        });        
    }]);