/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ViewProfileCtrl',["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window",
    function ($rootScope, $scope, $stateParams,RestService, $state, $cookies, $window) {

        $scope.user = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            info: '',
            score: '',
            rating: '',
            avatar: '',
            socialnetworks: [],
            tshirts: [],
            snippets: []
        };

        $rootScope.viewEditProfile = false;

        $scope.getTshirt = function (param) {
            RestService.fetchTshirt(param)
                .then(
                    function (data) {
                        if (data.length > 0){
                            $scope.getUser(data[0].owner);
                        } else {
                            $('#myModal').modal('show');
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getTshirt($stateParams.id);

        $scope.getUser = function (username) {
            RestService.fetchUserByUser(username)
                .then(
                    function (data) {
                        if (data.length > 0){
                            $scope.user.username = data[0].username;
                            $scope.user.firstname = data[0].first_name;
                            $scope.user.lastname = data[0].last_name;
                            $scope.user.email = data[0].email;

                            if (data[0].profiles.length > 0) {
                                getProfile(data[0].profiles[0]);
                            }
                            getTshirts(data[0].tshirts);
                            getSnippets(data[0].snippets);
                            getSocialNetworks(data[0].socialnetworks);

                        } else {
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
                            $scope.user.score = data.score;
                            $scope.user.rating = data.rating;
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

        var getSnippets = function (urls) {
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

        $scope.goToLink = function (link) {
            $window.open(link, '_blank');
        };
    }]);