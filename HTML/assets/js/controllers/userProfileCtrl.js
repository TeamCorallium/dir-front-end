/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('UserProfileCtrl',["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies",
    function ($rootScope, $scope, $stateParams,RestService, $state, $cookies) {

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

        $scope.getTshirt = function () {
            RestService.fetchTshirt($stateParams.id)
                .then(
                    function (data) {
                        if (data.length > 0){
                            console.log(data[0]['owner']);
                            $scope.getUser(data[0]['owner']);
                        } else {
                            $('#myModal').modal('show');
                        }
                    },
                    function (errResponse) {
                        console.log(errResponse);
                    }
                );
        };

        $scope.getUser = function (username) {
            RestService.fetchUserByUser(username)
                .then(
                    function (data) {
                        if (data.length > 0){
                            $scope.user.username = data[0].username;
                            $scope.user.firtname = data[0].first_name;
                            $scope.user.lastname = data[0].last_name;
                            $scope.user.email = data[0].email;

                            if (data[0].profiles.length > 0) {
                                getProfile(data[0].profiles[0]);
                            }
                            getTshirts(data[0].tshirts);
                            getSnippets(data[0].snippets);

                        } else {
                            //    Show Autentication
                            console.log("Show Autentication");
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
                            $scope.user.avatar = data.avatar;
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

        if ($cookies.get('sessionid') == undefined && $cookies.get('username')){
            $scope.getTshirt();
        } else {
            $scope.getUser($cookies.get('username'));
        }
    }]);