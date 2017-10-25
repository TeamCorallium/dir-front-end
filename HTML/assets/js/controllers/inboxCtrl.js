/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('InboxCtrl', ["$scope", "$state", "$cookies", "RestService", "filterFilter", "$rootScope",
    function ($scope, $state, $cookies, RestService, filterFilter, $rootScope) {

        $scope.inboxFlag = true;

        $rootScope.viewProfile = true;

        $scope.messageSelected = {
            url: '',
            id: '',
            sender: '',
            receiver: '',
            subject: '',
            body: '',
            created: '',
            readed: ''
        };

        $scope.changeInboxFlag = function (flag) {
            if (flag) {
                $scope.inboxFlag = true;
                if ($(window).width() <= 767) {
                    $('#MessageInboxBox').show();
                    $('#MessageReadBox').hide();
                }
                $scope.getMessageReceiver();
            } else {
                $scope.inboxFlag = false;
                if ($(window).width() <= 767) {
                    $('#MessageSendBox').show();
                    $('#MessageReadBox').hide();
                }
                $scope.getMessageSend();
            }
        };

        $scope.readUnreadMessage = function () {

        };

        $scope.emailIdSelected = '';

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

        $scope.getCount = function () {
            return filterFilter($scope.messagesInbox, { readed: false }).length;
        };

        $scope.selectMessageInbox = function (message) {
            $scope.messageSelected = {
                url: message.url,
                id: message.id,
                sender: message.sender,
                receiver: message.receiver,
                subject: message.subject,
                body: message.body,
                created: message.created,
                readed: true
            };

            if ($(window).width() <= 767) {
                $('#MessageInboxBox').hide();
                $('#MessageReadBox').show();
            }

            for (var i = 0; i < $scope.messagesInbox.length; i++) {
                if ($scope.messagesInbox[i].id == message.id) {
                    $scope.messagesInbox[i].readed = true;
                }
            }

            RestService.updateMessage($scope.messageSelected.url, $scope.messageSelected.id, $scope.messageSelected.created,
                $scope.messageSelected.sender, $scope.messageSelected.receiver, $scope.messageSelected.subject,
                $scope.messageSelected.body, $scope.messageSelected.readed);
        };

        $scope.selectMessageSend = function (message) {
            $scope.messageSelected = {
                url: message.url,
                id: message.id,
                sender: message.sender,
                receiver: message.receiver,
                subject: message.subject,
                body: message.body,
                created: message.created,
                readed: true
            };

            if ($(window).width() <= 767) {
                $('#MessageSendBox').hide();
                $('#MessageReadBox').show();
            }

            for (var i = 0; i < $scope.messagesSend.length; i++) {
                if ($scope.messagesInbox[i].id == message.id) {
                    $scope.messagesInbox[i].readed = true;
                }
            }

            RestService.updateMessage($scope.messageSelected.url, $scope.messageSelected.id, $scope.messageSelected.created,
                $scope.messageSelected.sender, $scope.messageSelected.receiver, $scope.messageSelected.subject,
                $scope.messageSelected.body, $scope.messageSelected.readed);
        };

        $scope.cleanMessageSelected = function () {
            $scope.messageSelected = {
                id: '',
                sender: '',
                receiver: '',
                subject: '',
                body: '',
                created: '',
                readed: ''
            };
        };

        $(window).on("resize.doResize", function () {

            $scope.$apply(function () {
                if ($(window).width() >= 768) {
                    if ($scope.inboxFlag) {
                        $('#MessageInboxBox').show();
                        $('#MessageReadBox').show();
                    } else {
                        $('#MessageSendBox').show();
                        $('#MessageReadBox').show();
                    }
                } else {
                    if ($scope.inboxFlag) {
                        $('#MessageInboxBox').show();
                        $('#MessageReadBox').hide();
                    } else {
                        $('#MessageSendBox').show();
                        $('#MessageReadBox').hide();
                    }
                }
            });
        });

        $scope.$on("$destroy", function () {
            $(window).off("resize.doResize"); //remove the handler added earlier
        });

        $scope.backToMessageList = function(message) {

            var flag = false;

            for (var i = 0; i < $scope.messagesInbox.length; i++) {
                if ($scope.messagesInbox[i].id == message.id) {
                    flag = true;
                }
            }

            if (flag){
                $scope.inboxFlag = true;
                $('#MessageSendBox').show();
                $('#MessageReadBox').hide();
            } else {
                $scope.inboxFlag = false;
                $('#MessageSendBox').show();
                $('#MessageReadBox').hide();
            }            
        };
    }]);