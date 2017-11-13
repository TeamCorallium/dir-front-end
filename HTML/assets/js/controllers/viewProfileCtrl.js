/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ViewProfileCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "$translate",
    function ($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, $translate) {

        $rootScope.OptionsEdit = false;

        var exploreUser = '';
        $scope.activateClap = false;
        $scope.activateFollow = false;
        $scope.mySelf = false;
        $scope.currentPage = 1;
        $scope.hasNext = '';
        $scope.hasPrevious = '';
        $scope.users = [];
        $rootScope.viewProfile = true;

        $scope.message = {
            username: '',
            exploreUser: '',
            title: '',
            body: '',
            readed: ''
        }

        $scope.user = {
            profileUrl: '',
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            info: '',
            score: '',
            rating: '',
            avatar: 'assets/images/default-user.png',
            id: '',
            qrcode: '',
            profileurl: '',
            fullname: '',
            socialnetworks: [],
            tshirts: [],
            snippets: []
        };

        $scope.TryClap = function () {
            RestService.takeClap($scope.user.id, true);
        };

        $scope.TryFollow = function () {
            RestService.follow($scope.user.id, true);
        };

        $scope.getUser = function (username) {
            RestService.fetchUserByUser(username)
                .then(
                    function (data) {
                        data = data.results;
                        if (data.length > 0) {
                            $scope.user.profileUrl = data[0].profiles[0];
                            $scope.user.username = data[0].username;
                            $scope.user.firstname = data[0].first_name;
                            $scope.user.lastname = data[0].last_name;

                            if ($scope.user.username == $cookies.get('username')) {
                                $scope.mySelf = true;
                            } else {
                                $scope.mySelf = false;
                            }

                            if (data[0].profiles.length > 0) {
                                getProfile(data[0].profiles[0]);
                            }

                            getSnippets(data[0].username, 1);
                            getSocialNetworks(data[0].username);

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

        var getProfile = function (url) {
            RestService.fetchObjectByUrl(url)
                .then(
                    function (data) {

                        if (data != undefined) {
                            $scope.user.info = data.info;
                            if (data.avatar != '' && data.avatar != null) {
                                var avatarArray = data.avatar.split("/");
                                $scope.user.avatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
                            } else {
                                $scope.user.avatar = 'assets/images/default-user.png';
                            }
                            $scope.user.id = data.id;
                            $scope.user.email = data.email;
                            $scope.user.score = data.score;
                            $scope.user.rating = data.rating;
                            $scope.user.fullname = data.fullname;
                            $scope.user.profileurl = data.url;

                            if (data.qrcode != '') {
                                $scope.user.qrcode = RestService.imageDir + data.qrcode;
                            }

                            if ($rootScope.viewInbox) {
                                $scope.TryClap();
                                $scope.TryFollow();
                            }
                        } else {
                            $state.go('home');
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        var getTshirts = function (urls) {
            for (var i = 0; i < urls.length; i++) {
                RestService.fetchObjectByUrl(urls[i])
                    .then(
                        function (data) {
                            $scope.user.tshirts.push(data);
                        },
                        function (errResponse) {
                            console.log(errResponse);
                            // throw toaster with message errResponse
                        }
                    );
            }
        };

        var getSnippets = function (username, page) {
            $scope.user.snippets = [];
            RestService.fetchSnippets(username + "&page=" + page)
                .then(
                    function (data) {
                        $scope.hasNext = data.next;
                        $scope.hasPrevious = data.previous;
                        data = data.results;
                        for (var i = 0; i < data.length; i++) {
                            $scope.user.snippets.push(data[i]);
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        var getSocialNetworks = function (username) {
            $scope.user.socialnetworks = [];
            RestService.fetchSocialNetworks(username)
                .then(
                    function (data) {
                        for (var i = 0; i < data.length; i++) {
                            $scope.user.socialnetworks.push(data[i]);
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.openModalSnippets = function () {
            if ($cookies.get('sessionid') != undefined) {
                $('#modalSnippets').modal('show');
            } else {
                $('#myModal').modal('show');
            }
        };

        $scope.openAddSocialNetworkModal = function () {
            if ($cookies.get('sessionid') != undefined) {
                $('#modalSocialNetwork').modal('show');
            } else {
                $('#myModal').modal('show');
            }
        };

        $scope.goToLink = function (link) {
            $window.open(link, '_blank');
        };

        $scope.getPopularUsers = function () {
            RestService.fetchObjectByUrl(RestService.profileDir + '?ordering=-score')
                .then(
                    function (data) {
                        $scope.users = data.results;
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getPopularUsers();

        $scope.goToProfile = function (owner) {
            $cookies.remove("exploreUser", {
                path: '/'
            });
            $cookies.put('exploreUser', owner, {
                path: '/'
            });

            if ($cookies.get('exploreUser') == $cookies.get('username')) {
                $state.go('profile');
            } else {
                $scope.getTshirt();
            }
        };

        $scope.getAvatar = function (avatar) {
            var dirAvatar = '';
            if (avatar != '' && avatar != null) {
                var avatarArray = avatar.split("/");
                dirAvatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
            } else {
                dirAvatar = 'assets/images/default-user.png';
            }

            return dirAvatar;
        };

        $scope.getTshirt = function () {

            $scope.user.username = '';
            $scope.user.firstname = '';
            $scope.user.lastname = '';
            $scope.user.email = '';
            $scope.user.info = '';
            $scope.user.score = '';
            $scope.user.rating = '';
            $scope.user.avatar = '';
            $scope.user.id = '';
            $scope.user.socialnetworks = [];
            $scope.user.tshirts = [];
            $scope.user.snippets = [];

            if ($cookies.get('exploreUser')) {
                $scope.getUser($cookies.get('exploreUser'));
                exploreUser = $cookies.get('exploreUser');
            } else {
                $state.go('home');
            }
        };

        $scope.getTshirt();

        $scope.noPrevious = function () {
            return $scope.hasPrevious == null;
        };

        $scope.noNext = function () {
            return $scope.hasNext == null;
        };

        $scope.next = function () {
            if (!$scope.noNext()) {
                $scope.currentPage += 1;
                getSnippets($scope.user.username, $scope.currentPage);
            }
        };

        $scope.previous = function () {
            if (!$scope.noPrevious()) {
                $scope.currentPage -= 1;
                getSnippets($scope.user.username, $scope.currentPage);
            }
        };

        $scope.leaveMessage = function () {
            if (exploreUser != '' && $cookies.get('username')) {
                var username = $cookies.get('username');
                RestService.sendMessage(username, exploreUser, $scope.message.title, $scope.message.body, false);
            } else {
                var unexpectedError = $translate.instant('view_profile.UNEXPECTED_ERROR');
                var sendMessage = $translate.instant('view_profile.SEND_MESSAGE');
                growl.error(unexpectedError, {
                    title: sendMessage
                });
                $state.go('users');
            }
        };

        $rootScope.$on('SendMessage', function (event, data) {
            $('#modalLeaveMessage').modal('hide');
            $scope.message.title = '';
            $scope.message.body = '';
            var sendCorrectly = $translate.instant('view_profile.SEND_CORRECTLY');
            var sendMessage = $translate.instant('view_profile.SEND_MESSAGE');
            growl.success(sendCorrectly, {
                title: sendMessage
            });
        });

        $rootScope.$on('SendMessageError', function (event, data) {
            var sendError = $translate.instant('view_profile.SEND_ERROR');
            var sendMessage = $translate.instant('view_profile.SEND_MESSAGE');
            growl.wrong(sendError, {
                title: sendMessage
            });
        });

        $scope.clap = function () {
            RestService.takeClap($scope.user.id, false);
        };

        $rootScope.$on('clapSuccesfully', function (event, data) {
            $scope.user.score = data;
            $scope.activateClap = true;
        });

        $scope.getStars = function (rating) {
            var val = parseFloat(rating);
            var size = val / 5 * 100;
            return size + '%';
        };

        $rootScope.$on('testClapYes', function (event, data) {
            $scope.activateClap = false;
        });

        $rootScope.$on('testClapNo', function (event, data) {
            $scope.activateClap = true;
        });

        $rootScope.$on('testFollowYes', function (event, data) {
            $scope.activateFollow = false;
        });

        $rootScope.$on('testFollowNo', function (event, data) {
            $scope.activateFollow = true;
        });

        $scope.leaveMessage = function () {
            if ($cookies.get('username') != '' && $cookies.get('username') != null && $cookies.get('username') != undefined) {
                $('#modalLeaveMessage').modal('show');
            } else {
                $('#myModalLoginHome').modal('show');
            }
        };

        $scope.makeClap = function () {
            if ($cookies.get('username') != '' && $cookies.get('username') != null && $cookies.get('username') != undefined) {
                if (!$scope.activateClap) {
                    $scope.clap();
                }
            } else {
                $('#myModalLoginHome').modal('show');
            }
        };

        $scope.follow = function () {
            if ($cookies.get('username') != '' && $cookies.get('username') != null && $cookies.get('username') != undefined) {
                if (!$scope.activateFollow) {
                    RestService.follow($scope.user.id, false);
                }
            } else {
                $('#myModalLoginHome').modal('show');
            }
        };

        $rootScope.$on('followSuccesfully', function (event, data) {
            $scope.activateFollow = true;
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

            var weProblem = $translate.instant('view_profile.WE_PROBLEM');
            var loginProblem = $translate.instant('view_profile.LOGIN_PROBLEM');
            growl.error(weProblem, {
                title: loginProblem
            });
        });

        $rootScope.$on('LoginNetworkConnectionError', function (event, data) {
            var serverNotFound = $translate.instant('view_profile.SERVER_NOT_FOUND');
            var networkConnection = $translate.instant('view_profile.NETWORK_CONNECTION');
            growl.error(serverNotFound, {
                title: networkConnection
            });
        });
    }
]);