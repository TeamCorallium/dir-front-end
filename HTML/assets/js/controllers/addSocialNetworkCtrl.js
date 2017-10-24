/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AddSocialNetworkCtrl', ["$rootScope", "$scope", "RestService", "$state", "$cookies", "growl",
    function ($rootScope, $scope, RestService, $state, $cookies, growl) {

        $scope.socialnetwork = '';
        $scope.url = '';

        $scope.updateUrl = function () {
            $scope.url = '';
            switch ($scope.socialnetwork) {
                case "Facebook": {
                    $scope.url = 'https://www.facebook.com/';
                    break;
                };
                case "Twitter": {
                    $scope.url = 'https://twitter.com/';
                    break;
                };
                case "LinkedIn": {
                    $scope.url = 'https://www.linkedin.com/in/';
                    break;
                };
                case "Instagram": {
                    $scope.url = 'https://www.instagram.com/';
                    break;
                };
                case "Reddit": {
                    $scope.url = 'https://www.reddit.com/user/';
                    break;
                };
                case "Google": {
                    $scope.url = 'https://plus.google.com/';
                    break;
                };
                case "YouTube": {
                    $scope.url = 'https://www.youtube.com/user/';
                    break;
                };
                case "RSS": {
                    $scope.url = 'https://www.rss.com/';
                    break;
                };
                case "Dropbox": {
                    $scope.url = 'https://www.dropbox.com/';
                    break;
                };
                case "GitHub": {
                    $scope.url = 'https://github.com/';
                    break;
                };
                case "Skype": {
                    $scope.url = 'https://www.skype.com/';
                    break;
                };
                case "Tumblr": {
                    $scope.url = 'https://www.tumblr.com/';
                    break;
                };
                case "Vimeo": {
                    $scope.url = 'https://vimeo.com/';
                    break;
                };
                case "WordPress": {
                    $scope.url = 'https://es.wordpress.org/';
                    break;
                };
                case "Yahoo": {
                    $scope.url = 'https://www.yahoo.com/';
                    break;
                };
                case "Flickr": {
                    $scope.url = 'https://www.flickr.com/';
                    break;
                };
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

    }]);