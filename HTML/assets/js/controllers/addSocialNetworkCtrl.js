/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AddSocialNetworkCtrl',["$rootScope", "$scope", "RestService", "$state", "$cookies",
    function ($rootScope, $scope,RestService, $state, $cookies) {

    $scope.socialnetwork = '';
    $scope.url = '';

        $scope.updateUrl = function () {

            switch($scope.socialnetwork) {
                case "Facebook": {
                    $scope.url = 'https://www.facebook.com/';
                };
                case "Twitter": {
                    $scope.url = 'https://twitter.com/';
                };
                case "LinkedIn": {
                    $scope.url = 'https://www.linkedin.com/in/';
                };
                case "Instagram": {
                    $scope.url = 'https://www.instagram.com/';
                };
                case "Reddit": {
                    $scope.url = 'https://www.reddit.com/user/';
                };
                case "Google": {
                    $scope.url = 'https://plus.google.com/';
                };
                case "YouTube": {
                    $scope.url = 'https://www.youtube.com/user/';
                };
                case "RSS": {
                    $scope.url = 'https://www.rss.com/';
                };
                case "Dropbox": {
                    $scope.url = 'https://www.dropbox.com/';
                };
                case "GitHub": {
                    $scope.url = 'https://github.com/';
                };
                case "Skype": {
                    $scope.url = 'https://www.skype.com/';
                };
                case "Tumblr": {
                    $scope.url = 'https://www.tumblr.com/';
                };
                case "Vimeo": {
                    $scope.url = 'https://vimeo.com/';
                };
                case "WordPress": {
                    $scope.url = 'https://es.wordpress.org/';
                };
                case "Yahoo": {
                    $scope.url = 'https://www.yahoo.com/';
                };
                case "Flickr": {
                    $scope.url = 'https://www.flickr.com/';
                };
            }
        };

        $scope.addSocialNetwork = function (name,url) {
            var type = '';

            if (name != '' && url!= ''){
                switch(name) {
                    case "Facebook": {
                        type = 'ti-facebook';
                    };
                    case "Twitter": {
                        type = 'ti-twitter';
                    };
                    case "LinkedIn": {
                        type = 'ti-linkedin';
                    };
                    case "Instagram": {
                        type = 'ti-instagram';
                    };
                    case "Reddit": {
                        type = 'ti-reddit';
                    };
                    case "Google": {
                        type = 'ti-google';
                    };
                    case "YouTube": {
                        type = 'ti-youtube';
                    };
                    case "RSS": {
                        type = 'ti-rss';
                    };
                    case "Dropbox": {
                        type = 'ti-dropbox';
                    };
                    case "GitHub": {
                        type = 'ti-github';
                    };
                    case "Skype": {
                        type = 'ti-skype';
                    };
                    case "Tumblr": {
                        type = 'ti-tumblr';
                    };
                    case "Vimeo": {
                        type = 'ti-vimeo';
                    };
                    case "WordPress": {
                        type = 'ti-wordpress';
                    };
                    case "Yahoo": {
                        type = 'ti-yahoo';
                    };
                    case "Flickr": {
                        type = 'ti-flickr';
                    };
                }
    
                RestService.addSocialNetwork(name,url,type);
            }
        };

    }]);