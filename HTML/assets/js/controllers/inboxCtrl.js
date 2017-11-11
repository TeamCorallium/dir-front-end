/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('InboxCtrl', ["$scope", "$state", "$cookies", "RestService", "filterFilter", "$rootScope", "growl", "SweetAlert", "$translate",
    function ($scope, $state, $cookies, RestService, filterFilter, $rootScope, growl, SweetAlert, $translate) {

        $scope.inboxFlag = true;
        $rootScope.OptionsEdit = false;
        $scope.messagesInbox = [];
        $scope.messagesSend = [];
        $cookies.remove("exploreUser", { path: '/' });

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
            } else {
                $scope.inboxFlag = false;
                if ($(window).width() <= 767) {
                    $('#MessageSendBox').show();
                    $('#MessageReadBox').hide();
                }                
            }
            $scope.getMessages();
        };

        $scope.getMessages = function () {
            $scope.messagesSend = [];
            $scope.messagesInbox = [];

            RestService.fetchMessages()
                .then(
                function (data) {
                    for (var i=0; i<data.length; i++){
                        if (data[i].sender == $cookies.get('username')) {
                            $scope.messagesSend.push(data[i]);
                        } else {
                            $scope.messagesInbox.push(data[i]);
                        }
                    }                    
                },
                function (errResponse) {
                    console.log(errResponse);
                }
                );
        };

        $scope.getMessages();

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
                readed: message.readed
            };

            if ($(window).width() <= 767) {
                $('#MessageInboxBox').hide();
                $('#MessageReadBox').show();
            }

            for (var i = 0; i < $scope.messagesInbox.length; i++) {
                if ($scope.messagesInbox[i].id == message.id) {
                    $scope.messagesInbox[i].readed = true;
                    var idClass = "#li-" + $scope.messagesInbox[i].id;
                    $(idClass).addClass("backgroundMessageSelectedColor");
                } else {
                    var idClass = "#li-" + $scope.messagesInbox[i].id;
                    $(idClass).removeClass("backgroundMessageSelectedColor");
                }
            }

            if(!$scope.messageSelected.readed) {
             $scope.messageSelected.readed = true;
             RestService.updateMessage($scope.messageSelected.url, $scope.messageSelected.sender,
                $scope.messageSelected.receiver, $scope.messageSelected.subject,
                $scope.messageSelected.body, $scope.messageSelected.readed);   
            }            
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
                readed: message.readed
            };

            if ($(window).width() <= 767) {
                $('#MessageSendBox').hide();
                $('#MessageReadBox').show();
            }
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
            var areYouSure = $translate.instant('user_profile.ARE_YOU_SURE');
            var textAreYouSure = $translate.instant('user_profile.TEXT_SURE');
            var yesDeleteIt = $translate.instant('user_profile.YES_DELETE');
            var noCancel = $translate.instant('user_profile.NO_CANCEL');
            var cancelled = $translate.instant('user_profile.CANCELLED');
            var messageSafe = $translate.instant('user_profile.SAVE_MESSAGE');
            SweetAlert.swal({
                title: areYouSure,
                text: textAreYouSure,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: yesDeleteIt,
                cancelButtonText: noCancel,
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    RestService.deleteMessage(url);
                } else {
                    SweetAlert.swal({
                        title: cancelled,
                        text: messageSafe,
                        type: "error",
                        confirmButtonColor: "#007AFF"
                    });
                }
            });
        };

        $rootScope.$on('SendMessage', function (event, data) {
            $('#modalMessage').modal('hide');
            var sendedSuccess = $translate.instant('inbox.SENDED_SUCCESS');
            var sendMessage = $translate.instant('inbox.SEND_MESSAGE');
            growl.success( sendedSuccess , { title: sendMessage });
        });

        $rootScope.$on('deleteMessage', function (event, data) {
            $scope.cleanMessageSelected();
            $scope.getMessages();
            var deleted = $translate.instant('inbox.DELETED');
            var messageDeleted = $translate.instant('inbox.MESSAGE_DELETED');
            SweetAlert.swal({
                title: deleted,
                text: messageDeleted,
                type: "success",
                confirmButtonColor: "#007AFF"
            });
        });

        $rootScope.$on('WrongMessage', function (event, data) {
            var errorSendMessage = $translate.instant('inbox.ERROR_SEND_MESSAGE');
            var sendMessage = $translate.instant('inbox.SEND_MESSAGE');
            growl.error( errorSendMessage , { title: sendMessage });
        });

        $rootScope.$on('deleteMessageError', function (event, data) {
            var errorDeleteMessage = $translate.instant('inbox.ERROR_DELETE_MESSAGE');
            var deleteMessage = $translate.instant('inbox.DELETE_MESSAGE');
            growl.error( errorDeleteMessage , { title: deleteMessage });
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

            var weProblem = $translate.instant('inbox.WE_PROBLEM');
            var loginProblem = $translate.instant('inbox.LOGIN_PROBLEM');
            growl.error( weProblem , { title: loginProblem });
        });

        $rootScope.$on('LoginNetworkConnectionError', function (event, data) {
            var serverNotFound = $translate.instant('inbox.SERVER_NOT_FOUND');
            var networkConnection = $translate.instant('inbox.NETWORK_CONNECTION');
            growl.error( serverNotFound , { title: networkConnection });
        });
    }]);