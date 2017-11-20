/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('NotificationsCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert", "$translate",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert, $translate) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", {
            path: '/'
        });

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

        $rootScope.notifications = [];

        $scope.getUser = function(username) {
            RestService.fetchUserByUser(username)
                .then(
                    function(data) {
                        data = data.results;
                        if (data.length > 0) {
                            $scope.user.profileUrl = data[0].profiles[0];
                            $scope.user.username = data[0].username;
                            $scope.user.firstname = data[0].first_name;
                            $scope.user.lastname = data[0].last_name;

                            if (data[0].profiles.length > 0) {
                                getProfile(data[0].profiles[0]);
                            }

                            getSocialNetworks(data[0].username);

                        } else {
                            $state.go('home');
                            $('#myModal').modal('show');
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        var getProfile = function(url) {
            RestService.fetchObjectByUrl(url)
                .then(
                    function(data) {

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
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        var getTshirts = function(urls) {
            for (var i = 0; i < urls.length; i++) {
                RestService.fetchObjectByUrl(urls[i])
                    .then(
                        function(data) {
                            $scope.user.tshirts.push(data);
                        },
                        function(errResponse) {
                            console.log(errResponse);
                        }
                    );
            }
        };

        var getSocialNetworks = function(username) {
            RestService.fetchSocialNetworks(username)
                .then(
                    function(data) {
                        for (var i = 0; i < data.length; i++) {
                            $scope.user.socialnetworks.push(data[i]);
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getUser($cookies.get('username'));

        $scope.goToLink = function(link) {
            $window.open(link, '_blank');
        };

        $scope.makeQRCode = function() {
            RestService.imageDownload($scope.user.id);
        };

        $scope.getPopularUsers = function() {
            RestService.fetchObjectByUrl(RestService.profileDir + '?ordering=-score')
                .then(
                    function(data) {
                        $scope.users = data.results;
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getPopularUsers();

        $scope.goToProfile = function(owner) {
            $cookies.remove("exploreUser", {
                path: '/'
            });
            $cookies.put('exploreUser', owner, {
                path: '/'
            });
            if ($cookies.get('exploreUser') == $cookies.get('username')) {
                $state.go('profile');
            } else {
                $state.go('tshirts');
            }
        };

        $scope.getAvatar = function(avatar) {
            var dirAvatar = '';

            if (avatar != '' && avatar != null) {
                var avatarArray = avatar.split("/");
                dirAvatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
            } else {
                dirAvatar = 'assets/images/default-user.png';
            }

            return dirAvatar;
        };

        $scope.noPrevious = function() {
            return $scope.hasPrevious == null;
        };

        $scope.noNext = function() {
            return $scope.hasNext == null;
        };

        $scope.next = function() {
            if (!$scope.noNext()) {
                $scope.currentPage += 1;
            }
        };

        $scope.previous = function() {
            if (!$scope.noPrevious()) {
                $scope.currentPage -= 1;
            }
        };

        $scope.getStars = function(rating) {
            var val = parseFloat(rating);
            var size = val / 5 * 100;
            return size + '%';
        };

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

            var weProblem = $translate.instant('user_profile.WE_PROBLEM');
            var loginProblem = $translate.instant('user_profile.LOGIN_PROBLEM');
            growl.error(weProblem, {
                title: loginProblem
            });
        });

        $rootScope.$on('LoginNetworkConnectionError', function(event, data) {
            var serverNotFound = $translate.instant('user_profile.SERVER_NOT_FOUND');
            var networkConnection = $translate.instant('user_profile.NETWORK_CONNECTION');
            growl.error(serverNotFound, {
                title: networkConnection
            });
        });

        $scope.getCount = function() {
            $rootScope.notificationCount = filterFilter($rootScope.notifications, { readed: false }).length;
        };

        $scope.getNotifications = function() {
            RestService.fetchNotification()
                .then(
                    function(data) {
                        $rootScope.notifications = data;

                        $scope.getCount();

                        for (var i = 0; i < $rootScope.notifications.length; i++) {
                            if ($rootScope.notifications[i].avatar != '' && $rootScope.notifications[i].avatar != null) {
                                var avatarArray = $rootScope.notifications[i].avatar.split("/");
                                $rootScope.notifications[i].avatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
                            } else {
                                $rootScope.notifications[i].avatar = 'assets/images/default-user.png';
                            }
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getNotifications();
    }
]);