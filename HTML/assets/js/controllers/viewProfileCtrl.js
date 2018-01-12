app.controller('ViewProfileCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "$translate",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, $translate) {

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
        $scope.indexShowMiddle = 0;
        $scope.showClaps = false;

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
            avatar: 'HTML/assets/images/default-user.png',
            cover: '',
            coverId: '',
            id: '',
            qrcode: '',
            profileurl: '',
            fullname: '',
            socialnetworks: [],
            tshirts: [],
            snippets: [],
            configVisible: '',
            configEmailVisible: '',
            configReceiveEmails: ''
        };

        $scope.limitSocialNetwork = 12;

        if ($(window).width() >= 1350) {
            $scope.limitSocialNetwork = 12;
        } else if ($(window).width() >= 1201) {
            $scope.limitSocialNetwork = 11;
        } else if ($(window).width() >= 992) {
            $scope.limitSocialNetwork = 8;
        } else if ($(window).width() >= 825) {
            $scope.limitSocialNetwork = 7;
        } else if ($(window).width() >= 768) {
            $scope.limitSocialNetwork = 6;
        } else if ($(window).width() >= 700) {
            $scope.limitSocialNetwork = 13;
        } else if ($(window).width() >= 650) {
            $scope.limitSocialNetwork = 12;
        } else if ($(window).width() >= 600) {
            $scope.limitSocialNetwork = 11;
        } else if ($(window).width() >= 550) {
            $scope.limitSocialNetwork = 10;
        } else if ($(window).width() >= 500) {
            $scope.limitSocialNetwork = 9;
        } else if ($(window).width() >= 450) {
            $scope.limitSocialNetwork = 8;
        } else if ($(window).width() >= 400) {
            $scope.limitSocialNetwork = 7;
        } else if ($(window).width() >= 350) {
            $scope.limitSocialNetwork = 6;
        } else {
            $scope.limitSocialNetwork = 5;
        }

        $(window).on("resize.doResize", function() {
            $scope.$apply(function() {
                if ($(window).width() >= 1350) {
                    $scope.limitSocialNetwork = 12;
                } else if ($(window).width() >= 1201) {
                    $scope.limitSocialNetwork = 11;
                } else if ($(window).width() >= 992) {
                    $scope.limitSocialNetwork = 8;
                } else if ($(window).width() >= 825) {
                    $scope.limitSocialNetwork = 7;
                } else if ($(window).width() >= 768) {
                    $scope.limitSocialNetwork = 6;
                } else if ($(window).width() >= 700) {
                    $scope.limitSocialNetwork = 13;
                } else if ($(window).width() >= 650) {
                    $scope.limitSocialNetwork = 12;
                } else if ($(window).width() >= 600) {
                    $scope.limitSocialNetwork = 11;
                } else if ($(window).width() >= 550) {
                    $scope.limitSocialNetwork = 10;
                } else if ($(window).width() >= 500) {
                    $scope.limitSocialNetwork = 9;
                } else if ($(window).width() >= 450) {
                    $scope.limitSocialNetwork = 8;
                } else if ($(window).width() >= 400) {
                    $scope.limitSocialNetwork = 7;
                } else if ($(window).width() >= 350) {
                    $scope.limitSocialNetwork = 6;
                } else {
                    $scope.limitSocialNetwork = 5;
                }
            });
        });

        $scope.TryClap = function() {
            RestService.takeClap($scope.user.id, true);
        };

        $scope.TryFollow = function() {
            RestService.follow($scope.user.id, true);
        };

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

                            if ($scope.user.username == $cookies.get('username')) {
                                $scope.mySelf = true;
                            } else {
                                $scope.mySelf = false;
                            }

                            if (data[0].profiles.length > 0) {
                                getProfile(data[0].profiles[0]);
                                getCoverPicture(data[0].username);
                            }
                        } else {
                            $state.go('home');
                            $('#myModal').modal('show');
                        }
                    },
                    function(errResponse) {
                        $state.go('userprivate');
                    }
                );
        };

        var getProfile = function(url) {
            url = url.replace("/api", RestService.urlBaseDir);
            RestService.fetchObjectByUrl(url)
                .then(
                    function(data) {
                        if (data != undefined) {
                            $scope.user.info = data.info;
                            if (data.avatar != '' && data.avatar != null) {
                                var avatarArray = data.avatar.split("/");
                                $scope.user.avatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
                            } else {
                                $scope.user.avatar = 'HTML/assets/images/default-user.png';
                            }
                            $scope.user.id = data.id;
                            $scope.user.email = data.email;
                            $scope.user.score = data.score;
                            if ($scope.user.score > 1) {
                                $scope.showClaps = true;
                            } else {
                                $scope.showClaps = false;
                            }
                            $scope.user.rating = data.rating;
                            $scope.user.fullname = data.fullname;
                            $scope.user.profileurl = data.url;
                            $scope.user.configVisible = data.confVisible;
                            if (!$scope.user.configVisible) {
                                $state.go('userprivate');
                            }
                            $scope.user.configEmailVisible = data.confEmailVisible;
                            $scope.user.configReceiveEmails = data.confReceiveMails;

                            $cookies.put('configVisible', $scope.user.configVisible, {
                                path: '/'
                            });

                            $cookies.put('configEmailVisible', $scope.user.configEmailVisible, {
                                path: '/'
                            });

                            $cookies.put('configReceiveEmails', $scope.user.configReceiveEmails, {
                                path: '/'
                            });

                            if (data.qrcode != '') {
                                $scope.user.qrcode = RestService.imageDir + data.qrcode;
                            }

                            if ($cookies.get('username')) {
                                $scope.TryClap();
                                $scope.TryFollow();
                            }

                            getSnippets($scope.user.username, 1);
                            getSocialNetworks($scope.user.username);

                            $scope.getPopularUsers();

                            if ($cookies.get('username')) {
                                $scope.getCount();
                            }
                        } else {
                            $state.go('userprivate');
                        }
                    },
                    function(errResponse) {
                        $state.go('userprivate');
                    }
                );
        };

        var getSnippets = function(username, page) {
            $scope.user.snippets = [];
            RestService.fetchSnippets(username + "&page=" + page)
                .then(
                    function(data) {
                        $scope.hasNext = data.next;
                        $scope.hasPrevious = data.previous;
                        data = data.results;
                        for (var i = 0; i < data.length; i++) {
                            $scope.user.snippets.push(data[i]);
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        var getSocialNetworks = function(username) {
            $scope.user.socialnetworks = [];
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

        var getCoverPicture = function(username) {
            $scope.user.cover = '';
            RestService.fetchCoverPicture(username)
                .then(
                    function(data) {
                        if (data.length > 0) {
                            $scope.user.cover = $scope.getCover(data[0].banner);
                            $scope.user.coverId = data[0].id;
                        }
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.openModalSnippets = function() {
            if ($cookies.get('sessionid') != undefined) {
                $('#modalSnippets').modal('show');
            } else {
                $('#myModal').modal('show');
            }
        };

        $scope.openAddSocialNetworkModal = function() {
            if ($cookies.get('sessionid') != undefined) {
                $('#modalSocialNetwork').modal('show');
            } else {
                $('#myModal').modal('show');
            }
        };

        $scope.goToLink = function(link) {
            $window.open(link, '_blank');
        };

        $scope.getPopularUsers = function() {
            RestService.fetchObjectByUrl(RestService.profileDir + '?ordering=-rating')
                .then(
                    function(data) {
                        $scope.users = data.results;
                    },
                    function(errResponse) {
                        console.log(errResponse);
                    }
                );
        };

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
                $scope.getTshirt();
            }
        };

        $scope.getAvatar = function(avatar) {
            var dirAvatar = '';
            if (avatar != '' && avatar != null) {
                var avatarArray = avatar.split("/");
                dirAvatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
            } else {
                dirAvatar = 'HTML/assets/images/default-user.png';
            }

            return dirAvatar;
        };

        $scope.getCover = function(cover) {
            var dirCover = '';

            if (cover != '' && cover != null) {
                var coverArray = cover.split("/");
                dirCover = RestService.imageDir + coverArray[coverArray.length - 1];
            } else {
                dirAvatar = 'HTML/assets/images/profile.jpg';
            }

            return dirCover;
        };

        $scope.getTshirt = function() {

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
            configVisible = '';
            configEmailVisible = '';
            configReceiveEmails = '';

            if ($cookies.get('exploreUser')) {
                $scope.getUser($cookies.get('exploreUser'));
                exploreUser = $cookies.get('exploreUser');
            } else {
                $state.go('userprivate');
            }
        };

        $scope.getTshirt();

        $scope.noPrevious = function() {
            return $scope.hasPrevious == null;
        };

        $scope.noNext = function() {
            return $scope.hasNext == null;
        };

        $scope.next = function() {
            if (!$scope.noNext()) {
                $scope.currentPage += 1;
                getSnippets($scope.user.username, $scope.currentPage);
            }
        };

        $scope.previous = function() {
            if (!$scope.noPrevious()) {
                $scope.currentPage -= 1;
                getSnippets($scope.user.username, $scope.currentPage);
            }
        };

        $scope.SendMessage = function() {
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

        $rootScope.$on('SendMessage', function(event, data) {
            $('#modalLeaveMessage').modal('hide');
            $scope.message.title = '';
            $scope.message.body = '';
            var sendCorrectly = $translate.instant('view_profile.SEND_CORRECTLY');
            var sendMessage = $translate.instant('view_profile.SEND_MESSAGE');
            growl.success(sendCorrectly, {
                title: sendMessage
            });
        });

        $rootScope.$on('SendMessageError', function(event, data) {
            var sendError = $translate.instant('view_profile.SEND_ERROR');
            var sendMessage = $translate.instant('view_profile.SEND_MESSAGE');
            growl.wrong(sendError, {
                title: sendMessage
            });
        });

        $scope.clap = function() {
            RestService.takeClap($scope.user.id, false);
        };

        $rootScope.$on('clapSuccesfully', function(event, data) {
            $scope.user.score = data;
            $scope.activateClap = true;
            if ($scope.user.score > 1) {
                $scope.showClaps = true;
            } else {
                $scope.showClaps = false;
            }
        });

        $scope.getStars = function(rating) {
            var val = parseFloat(rating);
            var size = val / 5 * 100;
            return size + '%';
        };

        $rootScope.$on('testClapYes', function(event, data) {
            $scope.activateClap = false;
        });

        $rootScope.$on('testClapNo', function(event, data) {
            $scope.activateClap = true;
        });

        $rootScope.$on('testFollowYes', function(event, data) {
            $scope.activateFollow = false;
        });

        $rootScope.$on('testFollowNo', function(event, data) {
            $scope.activateFollow = true;
        });

        $scope.leaveMessage = function() {
            if ($cookies.get('username') != '' && $cookies.get('username') != null && $cookies.get('username') != undefined) {
                $('#modalLeaveMessage').modal('show');
            } else {
                $('#myModalLoginHome').modal('show');
            }
        };

        $scope.makeClap = function() {
            if ($cookies.get('username') != '' && $cookies.get('username') != null && $cookies.get('username') != undefined) {
                if (!$scope.activateClap) {
                    $scope.clap();
                } else {
                    var alreadyClapped = $translate.instant('view_profile.ALREADY_CLAPPED');
                    growl.error(alreadyClapped);
                }
            } else {
                $('#myModalLoginHome').modal('show');
            }
        };

        $scope.follow = function() {
            if ($cookies.get('username') != '' && $cookies.get('username') != null && $cookies.get('username') != undefined) {
                if (!$scope.activateFollow) {
                    RestService.follow($scope.user.id, false);
                }
            } else {
                $('#myModalLoginHome').modal('show');
            }
        };

        $rootScope.$on('followSuccesfully', function(event, data) {
            $scope.activateFollow = true;
        });

        $rootScope.$on('forbidden', function(event, data) {
            $state.go('userprivate');
        });

        $rootScope.$on('LoginNetworkConnectionError', function(event, data) {
            $state.go('userprivate');
        });

        $scope.unfollow = function() {
            RestService.unfollow($scope.user.id);
            $scope.activateFollow = false;
        };

        $rootScope.$on('unfollowError', function(event, data) {
            var noUnfollow = $translate.instant('user_profile.NO_UNFOLLOW');
            growl.error(noUnfollow);
        });

        $rootScope.$on('UnfollowBad', function(event, data) {
            var noUnfollow = $translate.instant('user_profile.NO_UNFOLLOW');
            growl.error(noUnfollow);
            RestService.follow($scope.user.id, true);
        });

        $scope.changeMiddle = function(num) {
            $scope.indexShowMiddle = num;
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
    }
]);