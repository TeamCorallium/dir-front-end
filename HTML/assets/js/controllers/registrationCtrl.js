/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('RegistrationCtrl',["$scope", "RestService", "$state", "$rootScope",'$cookies',
    function ($scope, RestService, $state, $rootScope, $cookies) {

        if (RestService.getCookie('csrftoken') == null) {
            RestService.fetchObjectByUrl('http://10.58.20.244/api-auth/login/?next=/')
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

        $scope.registerModal = function (firstname, lastname, username, password, passAgain, email, pin) {
            if (password === passAgain) {
                RestService.register(username, password,firstname,lastname,email,pin);
            } else {
                //show error
            }
        };

        $rootScope.$on('register',function (event, data) {
            $('#myModal').modal('hide');
            $('#errorRegisterBox').hide();
            RestService.login(data.username,data.password);
        });

        $rootScope.$on('wrongRegister', function (event, data) {
            $('#errorRegisterBox').show();
        });
    }]);