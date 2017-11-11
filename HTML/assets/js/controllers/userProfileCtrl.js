/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('UserProfileCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert",
    function ($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert) {

        $rootScope.OptionsEdit = true;
        $cookies.remove("exploreUser", { path: '/' });

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

        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.currentPage = 1;
        $scope.hasNext = '';
        $scope.hasPrevious = '';
        $scope.users = [];
        $scope.profileQRCode = '';
        $rootScope.viewProfile = false;
        $rootScope.viewInbox = true;
        $scope.pSnippet = '';
        $scope.EditSnippetFlag = false;
        $scope.EditInfoFlag = false;

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
                        // data[i].body = replaceURLWithHTMLLinks(data[i].body);
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

        $scope.getUser($cookies.get('username'));

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

        $scope.EditProfile = function () {
            $scope.EditInfoFlag = !$scope.EditInfoFlag;
        };

        $scope.changeFlatEdit = function () {
            $scope.EditSnippetFlag = !$scope.EditSnippetFlag;
        };

        $scope.publishSnippets = function () {
            if ($scope.pSnippet != '') {
                RestService.addSnippet("", $scope.pSnippet);
            } else {
                growl.error("Cannot exist empty field", { title: 'Publish Snippet' });
            }
        };

        $scope.saveSnippetEdit = function (url, body) {
            RestService.updateSnippet(url, body);
        };

        $scope.deleteSnippet = function (url) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this snippet!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    RestService.deleteSnippet(url);
                } else {
                    SweetAlert.swal({
                        title: "Cancelled",
                        text: "Your snippet is safe :)",
                        type: "error",
                        confirmButtonColor: "#007AFF"
                    });
                }
            });
        };

        $scope.deleteSocialNetwork = function (id) {
            SweetAlert.swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this social network!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    RestService.deleteSocialNetwork(id);
                } else {
                    SweetAlert.swal({
                        title: "Cancelled",
                        text: "Your social network is safe :)",
                        type: "error",
                        confirmButtonColor: "#007AFF"
                    });
                }
            });
        };

        $rootScope.$on('snippetUpdated', function (event, data) {
            $scope.EditSnippetFlag = !$scope.EditSnippetFlag;

            $scope.user.snippets = [];
            getSnippets($cookies.get('username'), 1);
        });

        $rootScope.$on('updateProfile', function (event, data) {
            getProfile($scope.user.profileUrl);
            $scope.EditProfile();
        });

        $rootScope.$on('deleteSnippet', function (event, data) {
            SweetAlert.swal({
                title: "Deleted!",
                text: "Your snippet has been deleted.",
                type: "success",
                confirmButtonColor: "#007AFF"
            });

            $scope.user.snippets = [];
            getSnippets($cookies.get('username'), 1);
        });

        $rootScope.$on('deleteSocialNetwork', function (event, data) {
            SweetAlert.swal({
                title: "Deleted!",
                text: "Your social network has been deleted.",
                type: "success",
                confirmButtonColor: "#007AFF"
            });

            $scope.user.socialnetworks = [];
            getSocialNetworks($cookies.get('username'));
        });

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

        $rootScope.$on('addsnippets', function (event, data) {
            $scope.user.snippets = [];
            $('#modalSnippets').modal('hide');
            $scope.title = '';
            $scope.body = '';
            $scope.pSnippet = '';
            getSnippets($cookies.get('username'), 1);
        });

        $rootScope.$on('addsocialnetwork', function (event, data) {
            $scope.user.socialnetworks = [];
            $('#modalSocialNetwork').modal('hide');

            getSocialNetworks($cookies.get('username'));
        });

        $scope.goToLink = function (link) {
            $window.open(link, '_blank');
        };

        $scope.makeQRCode = function () {
            RestService.imageDownload($scope.user.id);
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

        $rootScope.$on('imageDownloadSuccesfull', function (event, data) {
            growl.success("QR Code Generated Correctly", { title: 'Generate QR Code' });
            $scope.user.qrcode = data;
        });

        $rootScope.$on('makeQRCodeError', function (event, data) {
            growl.error("Server Not Found. Check your internet connection.", { title: 'Network Connection' });
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
            if ($cookies.get('exploreUser') == $cookies.get('username')) {
                $state.go('profile');
            } else {
                $state.go('tshirts');
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

        $scope.getStars = function (rating) {
            var val = parseFloat(rating);
            var size = val / 5 * 100;
            return size + '%';
        };


        // Add Social Network
        $scope.socialnetwork = '';
        $scope.url = '';
        $scope.facebookName = '';
        $scope.showUrlCamp = false;
        $scope.activeFacebook = false;
        $scope.manuallyCheck = false;
        $scope.isConnected = false;

        $scope.updateUrl = function () {

            $scope.url = '';

            switch ($scope.socialnetwork) {
                case "Facebook": {
                    $scope.url = 'https://www.facebook.com/';
                    $scope.showUrlCamp = false;
                    $scope.activeFacebook = true;
                    $scope.isFacebookConnected();
                    break;
                };
                case "Twitter": {
                    $scope.url = 'https://twitter.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "LinkedIn": {
                    $scope.url = 'https://www.linkedin.com/in/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Instagram": {
                    $scope.url = 'https://www.instagram.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Reddit": {
                    $scope.url = 'https://www.reddit.com/user/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Google": {
                    $scope.url = 'https://plus.google.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "YouTube": {
                    $scope.url = 'https://www.youtube.com/user/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "RSS": {
                    $scope.url = 'https://www.rss.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Dropbox": {
                    $scope.url = 'https://www.dropbox.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "GitHub": {
                    $scope.url = 'https://github.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Skype": {
                    $scope.url = 'https://www.skype.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Tumblr": {
                    $scope.url = 'https://www.tumblr.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Vimeo": {
                    $scope.url = 'https://vimeo.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "WordPress": {
                    $scope.url = 'https://es.wordpress.org/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Yahoo": {
                    $scope.url = 'https://www.yahoo.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                case "Flickr": {
                    $scope.url = 'https://www.flickr.com/';
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                };
                default: {
                    $scope.showUrlCamp = true;
                    $scope.activeFacebook = false;
                    break;
                }
            }
        };

        $scope.updateUrl();

        $scope.addSocialNetwork = function () {
            var name = $scope.socialnetwork;
            var url = $scope.url;

            var type = '';

            if (name != '' && url != '') {
                switch (name) {
                    case "Facebook": {
                        type = 'ti-facebook';
                        break;
                    };
                    case "Twitter": {
                        type = 'ti-twitter';
                        break;
                    };
                    case "LinkedIn": {
                        type = 'ti-linkedin';
                        break;
                    };
                    case "Instagram": {
                        type = 'ti-instagram';
                        break;
                    };
                    case "Reddit": {
                        type = 'ti-reddit';
                        break;
                    };
                    case "Google": {
                        type = 'ti-google';
                        break;
                    };
                    case "YouTube": {
                        type = 'ti-youtube';
                        break;
                    };
                    case "RSS": {
                        type = 'ti-rss';
                        break;
                    };
                    case "Dropbox": {
                        type = 'ti-dropbox';
                        break;
                    };
                    case "GitHub": {
                        type = 'ti-github';
                        break;
                    };
                    case "Skype": {
                        type = 'ti-skype';
                        break;
                    };
                    case "Tumblr": {
                        type = 'ti-tumblr';
                        break;
                    };
                    case "Vimeo": {
                        type = 'ti-vimeo';
                        break;
                    };
                    case "WordPress": {
                        type = 'ti-wordpress';
                        break;
                    };
                    case "Yahoo": {
                        type = 'ti-yahoo';
                        break;
                    };
                    case "Flickr": {
                        type = 'ti-flickr';
                        break;
                    };
                }

                RestService.addSocialNetwork(name, url, type);

            } else {
                growl.success("Cannot exist empty fields", { title: 'Add Social Network' });
            }
        };

        $rootScope.$on('addSocialNetworkError', function (event, data) {
            growl.error("Server Not Found. Check your internet connection.", { title: 'Network Connection' });
        });

        $rootScope.$on('deleteSocialNetworkError', function (event, data) {
            growl.error("Error when attempting to remove their social network. Please check the status of your network.", { title: 'Delete Social Network' });
        });

        $scope.activeManually = function () {
            if ($scope.manuallyCheck) {
                $scope.showUrlCamp = true;
            } else {
                $scope.showUrlCamp = false;
            }
        };

        $scope.facebookLogin = function () {
            if (!$scope.isFacebookConnected()) {
                FB.login(function (response) {
                    if (response.status === 'connected') {
                        $scope.isConnected = true;
                        FB.api('me', function (response) {
                            console.log(response);
                            $scope.facebookName = response.name;
                            $scope.url = 'https://www.facebook.com/' + response.id;
                            $scope.addSocialNetwork("Facebook", $scope.url);
                        });
                    } else {
                        console.log("user canceled login or did not fully authorize");
                    }
                });
            } else {
                FB.api('me', function (response) {
                    console.log(response);
                });
            }
        };

        $scope.isFacebookConnected = function () {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    $scope.isConnected = true;
                } else {
                    $scope.isConnected = false;
                }
            });
        };

        $scope.isFacebookConnected();

        $scope.continueAsOther = function () {
            $scope.isConnected = false;
            FB.logout(function (response) {
                $scope.facebookLogin();
            });
        };

        // start: keyup social network
        $("#socialnetwork").on('keyup', function (e) {
            if (e.keyCode == 13) {
                var title = $('#socialnetwork').val();
                var url = $('#url').val();
                if (title != '' && title != null && url != '') {
                    $scope.addSocialNetwork(title, url);
                } else {
                    growl.error("Sorry all fields are required", { title: 'Empty fields' });
                }
            }
        });

        $("#url").on('keyup', function (e) {
            if (e.keyCode == 13) {
                var title = $('#socialnetwork').val();
                var url = $('#url').val();
                if (title != '' && title != null && url != '') {
                    $scope.addSocialNetwork(title, url);
                } else {
                    growl.error("Sorry all fields are required", { title: 'Empty fields' });
                }
            }
        });
        // end: keyup social network

        // Add Snippets
        $scope.snippets = '';
        $scope.title = '';
        $scope.body = '';

        $scope.addSnippets = function () {
            if ($scope.title != '' && $scope.body != '') {
                RestService.addSnippet($scope.title, $scope.body);
            } else {
                growl.error("Cannot exist empty fields", { title: 'Add Snippet' });
            }
        };

        $rootScope.$on('addSnippetsError', function (event, data) {
            growl.error("Server Not Found. Check your internet connection.", { title: 'Network Connection' });
        });

        // start:  keyup snippets
        $("#title").on('keyup', function (e) {
            if (e.keyCode == 13) {
                if ($scope.title != '' && $scope.body != '') {
                    RestService.addSnippet($scope.title, $scope.body);
                } else {
                    growl.error("Sorry all fields are required", { title: 'Empty fields' });
                }
            }
        });

        $("#body").on('keyup', function (e) {
            if (e.keyCode == 13) {
                if ($scope.title != '' && $scope.body != '') {
                    RestService.addSnippet($scope.title, $scope.body);
                } else {
                    growl.error("Sorry all fields are required", { title: 'Empty fields' });
                }
            }
        });
        // end: keyup snippets

        // CHANGE PASSWORD
        $scope.changePassword = function (psw, psw2) {
            if (psw === psw2) {
                RestService.changePassword($scope.user.username, psw);
            } else {
                $('#msg-block').show();
            }
        };

        $rootScope.$on('changepassword', function (event, data) {
            $('#modalChangePassword').modal('hide');
            $('#msg-block').hide();
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
                if ($("#changePasswordButton").prop('disabled') != undefined) {
                    if (pass != '' && passA != '') {
                        if (pass == passA) {
                            RestService.changePassword(pass, passA);
                        } else {
                            $('#msg-block').show();
                        }
                    } else {
                        growl.error("Sorry all fields are required", { title: 'Empty fields' });
                    }
                }
            }
        });

        $("#againPassHome").on('keyup', function (e) {
            if (e.keyCode == 13) {
                var pass = $('#password').val();
                var passA = $('#againPassHome').val();
                if ($("#changePasswordButton").prop('disabled') != undefined) {
                    if (pass != '' && passA != '') {
                        if (pass == passA) {
                            RestService.changePassword(pass, passA);
                        } else {
                            $('#msg-block').show();
                        }
                    } else {
                        growl.error("Sorry all fields are required", { title: 'Empty fields' });
                    }
                }
            }
        });
        // end: keyup change password

        // ADD T-Shirts 
        $scope.addTshirt = function() {
            if ($scope.codeModal != '') {
                RestService.addTShirt($scope.codeModal);
            }
        };

        $scope.TShirtLinks = [];        

        $rootScope.$on('addTshirt', function (event, data) {
            var tshirt = {
                code: $scope.codeModal,
                class: 'success'
            };

            $scope.TShirtLinks.unshift(tshirt);
            $scope.codeModal = '';
        });

        $rootScope.$on('addTshirtErrorBad', function (event, data) {
            var tshirt = {
                code: $scope.codeModal,
                class: 'wrong'
            };

            $scope.TShirtLinks.unshift(tshirt);
            $scope.codeModal = '';
            growl.error("This T-Shirt does not exist in stock.", { title: 'Add T-Shirt' });
        });

        $("#codeInput").on('keyup', function (e) {
            console.log($scope.codeModal + " codeModal");
            if (e.keyCode == 13) {
                $scope.addTshirt();
            }
        });
    }]);