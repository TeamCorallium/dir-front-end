/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('InboxCtrl',["$scope", "$state", "$cookies", "RestService", "filterFilter", "$rootScope",
    function ($scope, $state, $cookies, RestService, filterFilter, $rootScope) {

        $scope.inboxFlag = true;

        $rootScope.viewProfile = true;

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

        $scope.getCount = function(){
            return filterFilter( $scope.messagesInbox, {readed:false}).length;
        };

        $scope.messageSelected = {
            id: '',
            sender: '',
            receiver: '',
            subject: '',
            body: '',
            created: '',
            readed: ''
        };

        $scope.selectMessageInbox = function (id) {
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

            if ($(window).width() <= 767) {
                $('#MessageInboxBox').hide();
                $('#MessageReadBox').show();
            }

            for (var i=0; i<$scope.messagesInbox.length; i++){
                if ($scope.messagesInbox[i].id == id){
                    $scope.messageSelected.url = $scope.messagesInbox[i].url;
                    $scope.messageSelected.id = id;
                    $scope.messageSelected.sender = $scope.messagesInbox[i].sender;
                    $scope.messageSelected.receiver = $scope.messagesInbox[i].receiver;
                    $scope.messageSelected.subject = $scope.messagesInbox[i].subject;
                    $scope.messageSelected.body = $scope.messagesInbox[i].body;
                    $scope.messageSelected.created = $scope.messagesInbox[i].created;
                    $scope.messageSelected.readed = true;
                    $scope.messagesInbox[i].readed = true;
                }
            }

            RestService.updateMessage($scope.messageSelected.url,$scope.messageSelected.id,$scope.messageSelected.created,
                $scope.messageSelected.sender, $scope.messageSelected.receiver, $scope.messageSelected.subject,
                $scope.messageSelected.body, $scope.messageSelected.readed);
        };

        $scope.selectMessageSend = function (id) {
            $scope.messageSelected = {
                id: '',
                sender: '',
                receiver: '',
                subject: '',
                body: '',
                created: '',
                readed: ''
            };

            if ($(window).width() <= 767) {
                $('#MessageSendBox').hide();
                $('#MessageReadBox').show();
            }

            for (var i=0; i<$scope.messagesSend.length; i++){
                if ($scope.messagesSend[i].id == id){
                    $scope.messageSelected.id = id;
                    $scope.messageSelected.sender = $scope.messagesSend[i].sender;
                    $scope.messageSelected.receiver = $scope.messagesSend[i].receiver;
                    $scope.messageSelected.subject = $scope.messagesSend[i].subject;
                    $scope.messageSelected.body = $scope.messagesSend[i].body;
                    $scope.messageSelected.created = $scope.messagesSend[i].created;
                    $scope.messageSelected.readed = true;
                    $scope.messagesSend[i].readed = true;
                }
            }

            RestService.updateMessage($scope.messageSelected.url,$scope.messageSelected.id,$scope.messageSelected.created,
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

        $(window).on("resize.doResize", function (){

            $scope.$apply(function(){
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

        $scope.$on("$destroy",function (){
            $(window).off("resize.doResize"); //remove the handler added earlier
        });
    }]);