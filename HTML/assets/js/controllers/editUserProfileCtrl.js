/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('EditUserProfileCtrl', ["$scope", "$stateParams", "RestService", "$state", "$cookies", "$rootScope", "growl",
    function ($scope, $stateParams, RestService, $state, $cookies, $rootScope, growl) {

        $scope.myImage = '';
        $scope.myCroppedImage = '';

        $rootScope.viewProfile = true;
        $rootScope.viewInbox = true;

        $scope.currentPage = 1;
        $scope.hasNext = '';
        $scope.hasPrevious = '';

        $scope.uploadFile = function (file) {
            if (file) {
                // ng-img-crop
                var imageReader = new FileReader();
                imageReader.onload = function (image) {
                    $scope.$apply(function ($scope) {
                        $scope.myImage = image.target.result;
                    });
                };
                imageReader.readAsDataURL(file);
            }
        };

        $scope.user = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            info: '',
            score: '',
            rating: '',
            id: '',
            avatar: 'assets/images/default-user.png',
            profileurl: '',
            fullname: '',
            socialnetworks: [],
            tshirts: [],
            snippets: []
        };

        $scope.users = [];

        $scope.name = '';

        $scope.getUser = function (username) {
            RestService.fetchUserByUser(username)
                .then(
                function (data) {
                    data = data.results;
                    if (data.length > 0) {
                        $scope.user.username = data[0].username;
                        $scope.user.firstname = data[0].first_name;
                        $scope.user.lastname = data[0].last_name;
                        $scope.name = $scope.user.firstname + " " + $scope.user.lastname;

                        if (data[0].profiles.length > 0) {
                            $scope.getProfile(data[0].profiles[0]);
                        }
                        // $scope.getTshirts(data[0].tshirts);
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

        $scope.getProfile = function (url) {
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
                        $scope.user.profileurl = data.url;
                        $scope.user.fullname = data.fullname;
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
            for (var i = 0; i < urls.length; i++) {
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

        if ($cookies.get('username')) {
            $scope.getUser($cookies.get('username'));
        } else {
            $('#myModal').modal('show');
        }

        $scope.saveProfile = function () {
            if ($scope.user.avatar == 'assets/images/default-user.png') {
                $scope.user.avatar = '';
            }

            if ($scope.user.avatar instanceof File) {
                RestService.updateProfile($scope.user.profileurl, $scope.user.info, $scope.user.rating, $scope.user.score, $scope.user.avatar, $scope.user.fullname, $scope.user.email);
            } else {
                RestService.updateProfileWithOutAvatar($scope.user.profileurl, $scope.user.id, $scope.user.info, $scope.user.rating, $scope.user.score, $scope.user.fullname, $scope.user.email)
            }
        };

        $scope.deleteSocialNetwork = function (id) {
            console.log(id + " delete social network");
            RestService.deleteSocialNetwork(id);
        };

        $scope.deleteSnippets = function (url) {
            RestService.deleteSnippet(url);
        };

        $rootScope.$on('deleteSocialNetwork', function (event, data) {
            $scope.user.socialnetworks = [];
            getSocialNetworks($cookies.get('username'));

            growl.success("Social network delete correctly.", { title: 'Delete Social Network' });
        });

        $rootScope.$on('deleteSocialNetworkError', function (event, data) {
            growl.error("Error when attempting to remove their social network. Please check the status of your network.", { title: 'Delete Social Network' });
        });

        $rootScope.$on('deleteSnippet', function (event, data) {
            $scope.user.snippets = [];
            getSnippets($cookies.get('username'), 1);

            growl.success("Snippet delete correctly.", { title: 'Delete Social Network' });
        });

        $rootScope.$on('deleteSnippetError', function (event, data) {
            growl.error("Error when attempting to remove their snippet. Please check the status of your network.", { title: 'Delete Social Network' });
        });

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
            $state.go('tshirts');
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

        $scope.openModalImageCropper = function () {
            $('#ModalImageCropper').modal('show');
        };

        $scope.crop = function () {
            $scope.user.avatar = $scope.myCroppedImage;
            //return a promise that resolves with a File instance
            function urltoFile(url, filename, mimeType) {
                return (fetch(url)
                    .then(function (res) { return res.arrayBuffer(); })
                    .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
                );
            }

            urltoFile($scope.myCroppedImage, 'filename.png', 'image/png')
                .then(function (file) {
                    console.log(file);
                    $scope.user.avatar = file;
                })

            $('#ModalImageCropper').modal('hide');
        };

        $scope.noPrevious = function () {
            return $scope.hasPrevious == null;
        };

        $scope.noNext = function () {
            return $scope.hasNext == null;
        };

        $scope.next = function () {
            if (!$scope.noNext){
                $scope.currentPage += 1;
                getSnippets($scope.user.username, $scope.currentPage);
            }            
        };

        $scope.previous = function () {
            if (!$scope.noPrevious) {
                $scope.currentPage -= 1;
                getSnippets($scope.user.username, $scope.currentPage);
            }            
        };

        $scope.changePassword = function (psw, psw2) {
            if (psw === psw2) {
                RestService.changePassword($scope.user.username, psw);
            } else {
                growl.error("Password not match.", { title: 'Password Change' });
            }
        };

        $rootScope.$on('changepassword', function (event, data) {
            $('#modalChangePassword').modal('hide');
            growl.success("Password changed correctly.", { title: 'Password Change' });
        });

        $rootScope.$on('changepasswordError', function (event, data) {
            growl.error("Error when attempting to change password. Please check the status of your network.", { title: 'Password Change' });
        });

        // start:  keyup change password
        $("#password").on('keyup', function (e) {
            if (e.keyCode == 13) {
                var pass = $('#password').val();
                var passA = $('#againPassHome').val();
                console.log($("#changePasswordButton").is(":disabled") + " disable");
                if (pass != '' && passA != '') {
                    RestService.changePassword(pass, passA);
                } else {
                    growl.error("Sorry all fields are required", { title: 'Empty fields' });
                }
            }
        });

        $("#againPassHome").on('keyup', function (e) {
            if (e.keyCode == 13) {
                var pass = $('#password').val();
                var passA = $('#againPassHome').val();
                console.log($("#changePasswordButton").is(":disabled") + " disable");
                if (pass != '' && passA != '') {
                    RestService.changePassword(pass, passA);
                } else {
                    growl.error("Sorry all fields are required", { title: 'Empty fields' });
                }
            }
        });
        // end: keyup change password

        $scope.getStars = function (rating) {
            var val = parseFloat(rating);
            var size = val / 5 * 100;
            return size + '%';
        };
    }]);