/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('InboxCtrl',["$scope", "$state", "$cookies", "RestService",
    function ($scope, $state, $cookies, RestService) {

        $scope.inboxFlag = true;

        $scope.changeInboxFlag = function (flag) {
            if (flag) {
                $scope.inboxFlag = true;
            } else {
                $scope.inboxFlag = false;
            }
        };

        $scope.messagesInbox = [];
        $scope.messagesSend = [];

        $scope.getMessageSend = function () {
            RestService.fetchMessages($cookies.get('username'),"sender")
                .then(
                    function (data) {
                        if (data.length > 0){
                            $scope.messagesSend = data;
                        } else {
                            $state.go('home');
                            $('#myModal').modal('show');
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getMessageReceiver = function () {
            RestService.fetchMessages($cookies.get('username'),"receiver")
                .then(
                    function (data) {
                        if (data.length > 0){
                            $scope.messagesInbox = data;
                        } else {
                            $state.go('home');
                            $('#myModal').modal('show');
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getMessageReceiver();
        $scope.getMessageSend();

    }]);