/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ContactUsCtrl', ["$scope", "$state", "$rootScope", "RestService", "$cookies", "growl",
    function ($scope, $state, $rootScope, RestService, $cookies, growl) {

        if($cookies.get('sessionid')) {
            $rootScope.viewInbox = true;
            $rootScope.viewProfile = true;
        } else {
            $rootScope.viewInbox = false;
            $rootScope.viewProfile = false;
        }

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
            if ($scope.message.email != '' && $scope.message.subject != '' && $scope.message.body != ''){
                RestService.sendMessage($scope.message.email, 'admin', $scope.message.subject, $scope.message.body, false);
            } else {
                growl.error("All fields are required", { title: 'Send Message' });
            }            
        };

        $rootScope.$on('SendMessage', function (event, data) {
            $scope.message.email = '';
            $scope.message.subject = '';
            $scope.message.body = '';
            growl.success("Message sended correctly", { title: 'Send Message' });
        });

        $rootScope.$on('WrongMessage', function (event, data) {
            growl.error("Error sending message, please try again", { title: 'Send Message' });
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

            growl.error("We detected some problems, please try again", { title: 'Logins Problems' });
        });

        $rootScope.$on('LoginNetworkConnectionError', function (event, data) {
            growl.error("Server Not Found. Check your internet connection.", { title: 'Network Connection' });
        });

    }]);