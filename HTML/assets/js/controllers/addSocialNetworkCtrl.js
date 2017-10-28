/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AddSocialNetworkCtrl', ["$rootScope", "$scope", "RestService", "$state", "$cookies", "growl",
    function ($rootScope, $scope, RestService, $state, $cookies, growl) {

        $scope.socialnetwork = '';
        $scope.url = '';
        $scope.facebookName = '';

        $scope.showUrlCamp = false;
        $scope.activeFacebook = false;

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

        $scope.addSocialNetwork = function (name, url) {
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

        $scope.manuallyCheck = false;

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
                            $scope.url += response.id;
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

        $scope.isConnected = false;

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

    }]);