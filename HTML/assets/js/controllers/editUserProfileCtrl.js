/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('EditUserProfileCtrl',["$scope", "$stateParams", "RestService", "$state", "$cookies", "$rootScope",
    function ($scope, $stateParams,RestService, $state, $cookies, $rootScope) {

        $scope.user = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            info: '',
            score: '',
            rating: '',
            avatar: 'assets/images/default-user.png',
            profileurl: '',
            socialnetworks: [],
            tshirts: [],
            snippets: []
        };

        $scope.users = [];

        $scope.name = '';

        $rootScope.viewEditProfile = true;
        $rootScope.viewProfile = true;

        $scope.getUser = function (username) {
            RestService.fetchUserByUser(username)
                .then(
                    function (data) {
                        data = data.result;
                        if (data.length > 0){
                            $scope.user.username = data[0].username;
                            $scope.user.firstname = data[0].first_name;
                            $scope.user.lastname = data[0].last_name;
                            $scope.user.email = data[0].email;
                            $scope.name = $scope.user.firstname+" "+$scope.user.lastname;

                            if (data[0].profiles.length > 0) {
                                $scope.getProfile(data[0].profiles[0]);
                            }
                            // $scope.getTshirts(data[0].tshirts);
                            $scope.getSnippets(data[0].snippets);
                            getSocialNetworks(data[0].socialnetworks);

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

        $scope.getProfile = function (url) {
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
                            $scope.user.score = data.score;
                            $scope.user.rating = data.rating;
                            $scope.user.profileurl = data.url;
                        } else {
                            $('#myModal').modal('show');
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getTshirts = function (urls) {
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

        $scope.getSnippets = function (urls) {
            for (var i=0; i<urls.length; i++){
                RestService.fetchObjectByUrl(urls[i])
                    .then(
                        function (data) {
                            data.body = replaceURLWithHTMLLinks(data.body);
                            $scope.user.snippets.push(data);
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            }
        };

        var getSocialNetworks = function (urls) {
            for (var i=0; i<urls.length; i++){
                RestService.fetchObjectByUrl(urls[i])
                    .then(
                        function (data) {
                            $scope.user.socialnetworks.push(data);
                        },
                        function (errResponse) {
                            console.log(errResponse);
                        }
                    );
            }
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

        if ($cookies.get('username')){
            $scope.getUser($cookies.get('username'));
        } else {
            $('#myModal').modal('show');
        }

        $scope.saveProfile = function () {
            if ($scope.user.avatar == 'assets/images/default-user.png'){
                $scope.user.avatar = '';
            }
            RestService.updateProfile($scope.user.profileurl,$scope.user.info,$scope.user.rating,$scope.user.score,$scope.user.avatar);
        };

        $scope.deleteSocialNetwork = function (id) {
            RestService.deleteSocialNetwork(id);
        };

        $scope.deleteSnippets = function (url) {
            RestService.deleteSnippet(url);
        };

        $rootScope.$on('deleteSocialNetwork', function (event, data) {
            $scope.user.username =  '';
            $scope.user.firstname = '';
            $scope.user.lastname = '';
            $scope.user.email = '';
            $scope.user.info = '';
            $scope.user.score = '';
            $scope.user.rating = '';
            $scope.user.avatar = '';
            $scope.user.socialnetworks = [];
            $scope.user.tshirts = [];
            $scope.user.snippets = [];

            $scope.getUser($cookies.get('username'));
        });

        $rootScope.$on('deleteSnippet', function (event, data) {
            $scope.user.username =  '';
            $scope.user.firstname = '';
            $scope.user.lastname = '';
            $scope.user.email = '';
            $scope.user.info = '';
            $scope.user.score = '';
            $scope.user.rating = '';
            $scope.user.avatar = '';
            $scope.user.socialnetworks = [];
            $scope.user.tshirts = [];
            $scope.user.snippets = [];

            $scope.getUser($cookies.get('username'));
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