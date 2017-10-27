/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('InboxCtrl', ["$scope", "$state", "$cookies", "RestService", "filterFilter", "$rootScope", "growl", "SweetAlert",
    function ($scope, $state, $cookies, RestService, filterFilter, $rootScope, growl, SweetAlert) {

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

        $scope.messagesInbox = [];
        $scope.messagesSend = [];

        $scope.getMessageSend = function () {
            $scope.messagesSend = [];

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
            $scope.messagesInbox = [];

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
                    var idClass = "#li-"+message.id
                    $(idClass).addClass("backgroundMessageSelectedColor");
                }
            }            

            RestService.updateMessage($scope.messageSelected.url, $scope.messageSelected.sender,
                $scope.messageSelected.receiver, $scope.messageSelected.subject,
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
                if ($scope.messagesSend[i].id == message.id) {
                    $scope.messagesSend[i].readed = true;
                }
            }

            RestService.updateMessage($scope.messageSelected.url, $scope.messageSelected.sender,
                $scope.messageSelected.receiver, $scope.messageSelected.subject,
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

        $scope.backToMessageList = function (message) {

            var flag = false;

            for (var i = 0; i < $scope.messagesInbox.length; i++) {
                if ($scope.messagesInbox[i].id == message.id) {
                    flag = true;
                }
            }

            if (flag) {
                $scope.inboxFlag = true;
                $('#MessageInboxBox').show();
                $('#MessageReadBox').hide();
            } else {
                $scope.inboxFlag = false;
                $('#MessageSendBox').show();
                $('#MessageReadBox').hide();
            }
        };

        $scope.sendMessage = function (sender, receiver, subject, body) {
            RestService.sendMessage(sender, receiver, subject, body, false);
        };

        $scope.deleteMessage = function (url) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this message!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    RestService.deleteMessage(url);
                } else {
                    SweetAlert.swal({
                        title: "Cancelled",
                        text: "Your message is safe :)",
                        type: "error",
                        confirmButtonColor: "#007AFF"
                    });
                }
            });
        };

        $rootScope.$on('SendMessage', function (event, data) {
            $('#modalMessage').modal('hide');
            growl.success("Message sended correctly", { title: 'Send Message' });
        });

        $rootScope.$on('deleteMessage', function (event, data) {
            $scope.getMessageReceiver();
            $scope.getMessageSend();
            SweetAlert.swal({
                title: "Deleted!",
                text: "Your imaginary file has been deleted.",
                type: "success",
                confirmButtonColor: "#007AFF"
            });
        });

        $rootScope.$on('WrongMessage', function (event, data) {
            growl.error("Error sending message, please try again", { title: 'Send Message' });
        });

        $rootScope.$on('deleteMessageError', function (event, data) {
            growl.error("Error when try delete message, please try again", { title: 'Delete Message' });
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