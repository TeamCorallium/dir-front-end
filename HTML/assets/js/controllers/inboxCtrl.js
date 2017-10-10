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
                $scope.getMessageReceiver();
            } else {
                $scope.inboxFlag = false;
                $scope.getMessageSend();
            }
        };

        $scope.messagesInbox = [];
        $scope.messagesSend = [];

        $scope.getMessageSend = function () {
            RestService.fetchMessages($cookies.get('username'), "sender")
                .then(
                    function (data) {
                        $scope.messagesSend = data;
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getMessageReceiver = function () {
            RestService.fetchMessages($cookies.get('username'), "receiver")
                .then(
                    function (data) {
                        $scope.messagesInbox = data;
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getMessageReceiver();
        $scope.getMessageSend();

        $scope.getCount = function(){
            return filterFilter( $scope.messagesInbox, {readed:false}).length;
        };
    }]);