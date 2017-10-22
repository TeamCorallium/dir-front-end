/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('UserProfileCtrl',["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "ngtimeago",
    function ($rootScope, $scope, $stateParams,RestService, $state, $cookies, $window, ngtimeago) {

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
            socialnetworks: [],
            tshirts: [],
            snippets: []
        };

        $scope.users = [];

        $scope.profileQRCode = '';

        $rootScope.viewProfile = false;

        $scope.getUser = function (username) {
            RestService.fetchUserByUser(username)
                .then(
                    function (data) {
                        data = data.results;
                        if (data.length > 0){
                            $scope.user.username = data[0].username;
                            $scope.user.firstname = data[0].first_name;
                            $scope.user.lastname = data[0].last_name;
                            $scope.user.email = data[0].email;

                            if (data[0].profiles.length > 0) {
                                getProfile(data[0].profiles[0]);
                            }
                            
                            getSnippets(data[0].username);
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

                        if (data != undefined){
                            $scope.user.info = data.info;
                            if (data.avatar != '' && data.avatar != null){
                                var avatarArray = data.avatar.split("/");
                                $scope.user.avatar = RestService.imageDir+avatarArray[avatarArray.length-1];
                            } else {
                                $scope.user.avatar = 'assets/images/default-user.png';
                            }
                            $scope.user.id = data.id;
                            $scope.user.score = data.score;
                            $scope.user.rating = data.rating;
                            $scope.user.profileurl = data.url;
                        } else {
                            //    Show Autentication
                            console.log("profile no exist");
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        var getTshirts = function (urls) {
            for (var i=0; i<urls.length; i++){
                RestService.fetchObjectByUrl(urls[i])
                    .then(
                        function (data) {
                            $scope.user.tshirts.push(data);
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            }
        };

        var getSnippets = function (username) {
            RestService.fetchSnippets(username)
                .then(
                    function (data) {
                        for (var i=0; i<data.length; i++){
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
                        for (var i=0; i<data.length; i++){
                            $scope.user.socialnetworks.push(data[i]);
                        }                        
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        var replaceURLWithHTMLLinks = function(text) {
            var re = /(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig;
            return text.replace(re, function(match, lParens, url) {
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

        $scope.getUser($cookies.get('username'));

        $scope.openModalSnippets = function () {
            if($cookies.get('sessionid') != undefined){
                $('#modalSnippets').modal('show');
            } else {
                $('#myModal').modal('show');
            }
        };

        $scope.openAddSocialNetworkModal = function () {
            if($cookies.get('sessionid') != undefined){
                $('#modalSocialNetwork').modal('show');
            } else {
                $('#myModal').modal('show');
            }
        };

        $rootScope.$on('addsnippets', function (event, data) {
            $scope.user.username =  '';
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

            $('#modalSnippets').modal('hide');
            $state.go('profile');
            $scope.getUser($cookies.get('username'));
        });

        $rootScope.$on('addsocialnetwork', function (event, data) {
            $scope.user.username =  '';
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

            $('#modalSocialNetwork').modal('hide');
            $state.go('profile');
            $scope.getUser($cookies.get('username'));
        });

        $scope.goToLink = function (link) {
            $window.open(link, '_blank');
        };

        $scope.makeQRCode = function () {
            RestService.imageDownload();
        };

        $rootScope.$on('imageDownloadSuccesfull', function (event, data) {
            $scope.profileQRCode = data;
        });

        $scope.getPopularUsers = function () {
            RestService.fetchObjectByUrl(RestService.profileDir)
                .then(
                    function (data) {
                        $scope.users = data;
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getPopularUsers();

        $scope.goToProfile = function (owner) {
            $cookies.put('exploreUser',owner,{path: '/'});
            $state.go('tshirts');
        };

        $scope.getAvatar = function (avatar) {
            var dirAvatar = '';
            if (avatar != '' && avatar != null){
                var avatarArray = avatar.split("/");
                dirAvatar = RestService.imageDir + avatarArray[avatarArray.length-1];
            } else {
                dirAvatar = 'assets/images/default-user.png';
            }

            return dirAvatar;
        };
    }]);