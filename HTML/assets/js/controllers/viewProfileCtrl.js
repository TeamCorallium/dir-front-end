/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ViewProfileCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl",
    function ($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl) {

        if ($cookies.get('sessionid')) {
            $rootScope.viewInbox = true;
        } else {
            $rootScope.viewInbox = false;
        }

        var exploreUser = '';

        $scope.activateClap = false;

        $scope.user = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            info: '',
            score: '',
            rating: '',
            avatar: 'assets/images/default-user.png',
            id: '',
            profileurl: '',
            fullname: '',
            socialnetworks: [],
            tshirts: [],
            snippets: []
        };

        $scope.currentPage = 1;
        $scope.hasNext = '';
        $scope.hasPrevious = '';

        $scope.users = [];

        $rootScope.viewProfile = true;

        $scope.TryClap = function () {
            RestService.takeClap($scope.user.id, true);
        };

        $scope.getUser = function (username) {
            RestService.fetchUserByUser(username)
                .then(
                function (data) {
                    data = data.results;
                    if (data.length > 0) {
                        $scope.user.username = data[0].username;
                        $scope.user.firstname = data[0].first_name;
                        $scope.user.lastname = data[0].last_name;

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
                        
                        if ($rootScope.viewInbox) {
                            $scope.TryClap();
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
                        data[i].body = replaceURLWithHTMLLinks(data[i].body);
                        $scope.user.snippets.push(data[i]);
                    }
                },
                function (errResponse) {
                    console.log(errResponse);
                }
                );
        };

        var getSocialNetworks = function (username) {
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

        var replaceURLWithHTMLLinks = function (text) {
            var re = /(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig;
            return text.replace(re, function (match, lParens, url) {
                var rParens = '';
                lParens = lParens || '';

                // Try to strip the same number of right parens from url
                // as there are left parens.  Here, lParenCounter must be
                // a RegExp object.  You cannot use a literal
                //     while (/\(/g.exec(lParens)) { ... }
                // because an object is needed to store the lastIndex state.
                var lParenCounter = /\(/g;
                while (lParenCounter.exec(lParens)) {
                    var m;
                    // We want m[1] to be greedy, unless a period precedes the
                    // right parenthesis.  These tests cannot be simplified as
                    //     /(.*)(\.?\).*)/.exec(url)
                    // because if (.*) is greedy then \.? never gets a chance.
                    if (m = /(.*)(\.\).*)/.exec(url) ||
                        /(.*)(\).*)/.exec(url)) {
                        url = m[1];
                        rParens = m[2] + rParens;
                    }
                }
                return lParens + "<a href='" + url + "'>" + url + "</a>" + rParens;
            });
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
            $cookies.remove("exploreUser", { path: '/' });
            $cookies.put('exploreUser', owner, { path: '/' });
            $scope.getTshirt();
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
                RestService.fetchTshirt($stateParams.id)
                    .then(
                    function (data) {
                        if (data.length > 0) {
                            $scope.getUser(data[0].owner);
                        } else {
                            $state.go('home');
                            $('#myModal').modal('show');
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                    );
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
            $scope.currentPage += 1;
            getSnippets($scope.user.username, $scope.currentPage);
        };

        $scope.previous = function () {
            $scope.currentPage -= 1;
            getSnippets($scope.user.username, $scope.currentPage);
        };

        $scope.leaveMessage = function (subject, body) {
            if (exploreUser != '' && $cookies.get('username')) {
                var username = $cookies.get('username');
                RestService.sendMessage(username, exploreUser, subject, body, false);
            } else {
                growl.error("An unexpected error has occurred, please try again.", { title: 'Send Message' });
                $state.go('home');
            }
        };

        $rootScope.$on('SendMessage', function (event, data) {
            $('#modalLeaveMessage').modal('hide');
            growl.success("Message sended correctly", { title: 'Send Message' });
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

    }]);