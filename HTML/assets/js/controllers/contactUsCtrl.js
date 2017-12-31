app.controller('ContactUsCtrl', ["$scope", "$state", "$rootScope", "RestService", "$cookies", "growl", "$translate",
    function($scope, $state, $rootScope, RestService, $cookies, growl, $translate) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", { path: '/' });

        $scope.message = {
            email: '',
            subject: '',
            body: ''
        };

        $scope.getCount = function() {
            RestService.fetchNotificationUnreaded()
                .then(
                    function(data) {
                        var count = data;

                        if (count > 9) {
                            $rootScope.notificationCount = '10';
                        } else {
                            $rootScope.notificationCount = count;
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        var getUser = function(username) {
            RestService.fetchUserByUser(username)
                .then(
                    function(data) {
                        data = data.results;
                        $scope.message.email = data[0].email;
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        if ($cookies.get('username')) {
            getUser($cookies.get('username'));
        }

        $scope.sendMessage = function() {
            if ($scope.message.email != '' && $scope.message.subject != '' && $scope.message.body != '') {
                RestService.leaveMessage($scope.message.email, $scope.message.subject, $scope.message.body);
            } else {
                var emptyFields = $translate.instant('contact.EMPTY_FIELDS');
                var sendMessage = $translate.instant('contact.SEND_MESSAGE');
                growl.error(emptyFields, { title: sendMessage });
            }
        };

        $rootScope.$on('SendMessage', function(event, data) {
            // $scope.message.email = '';
            // $scope.message.subject = '';
            // $scope.message.body = '';
            var sendSuccess = $translate.instant('contact.SEND_CORRECTLY');
            var sendMessage = $translate.instant('contact.SEND_MESSAGE');
            growl.success(sendSuccess, { title: sendMessage });
        });

        $rootScope.$on('WrongMessage', function(event, data) {
            var messageError = $translate.instant('contact.MESSAGE_ERROR');
            var sendMessage = $translate.instant('contact.SEND_MESSAGE');
            growl.error(messageError, { title: sendMessage });
        });

        $rootScope.$on('forbidden', function(event, data) {
            if (RestService.getCookie('csrftoken') == null) {
                RestService.fetchObjectByUrl(RestService.loginNext)
                    .then(
                        function(data) {
                            console.log('get get ' + RestService.getCookie('csrftoken'));
                        },
                        function(errResponse) {
                            console.log(errResponse);
                        }
                    );

            } else {
                console.log(RestService.getCookie('csrftoken'));
            }

            var weProblem = $translate.instant('contact.WE_PROBLEM');
            var sendMessage = $translate.instant('contact.SEND_MESSAGE');
            growl.error(weProblem, { title: sendMessage });
        });

        $rootScope.$on('LoginNetworkConnectionError', function(event, data) {
            var serverNotFound = $translate.instant('contact.SERVER_NOT_FOUND');
            var networkConnection = $translate.instant('contact.NETWORK_CONNECTION');
            growl.error(serverNotFound, { title: networkConnection });
        });

        if ($cookies.get('username')) {
            $scope.getCount();
        }
    }
]);