/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AddSocialNetworkCtrl',["$rootScope", "$scope", "RestService", "$state", "$cookies",
    function ($rootScope, $scope,RestService, $state, $cookies) {

    $scope.socialnetwork = '';
    $scope.url = '';

        $scope.updateUrl = function () {
            if ($scope.socialnetwork == 'Facebook'){
                $scope.url = 'https://www.facebook.com/';
            } else if ($scope.socialnetwork == 'Twitter'){
                $scope.url = 'https://twitter.com/';
            } else if ($scope.socialnetwork == 'LinkedIn'){
                $scope.url = 'https://www.linkedin.com/in/';
            } else if ($scope.socialnetwork == 'Instagram'){
                $scope.url = 'social-instagram';
            } else if ($scope.socialnetwork == 'Reddit'){
                $scope.url = 'https://www.reddit.com/user/';
            } else if ($scope.socialnetwork == 'Google'){
                $scope.url = 'social-google';
            } else if ($scope.socialnetwork == 'YouTube'){
                $scope.url = 'https://www.youtube.com/user/';
            } else if ($scope.socialnetwork == 'RSS'){
                $scope.url = 'social-rss';
            } else if ($scope.socialnetwork == 'Behance'){
                $scope.url = 'social-behance';
            } else if ($scope.socialnetwork == 'Dropbox'){
                $scope.url = 'social-dropbox';
            } else if ($scope.socialnetwork == 'GitHub'){
                $scope.url = 'social-github';
            } else if ($scope.socialnetwork == 'Skype'){
                $scope.url = 'social-skype';
            } else if ($scope.socialnetwork == 'Spotify'){
                $scope.url = 'social-spotify';
            } else if ($scope.socialnetwork == 'StumbleUpon'){
                $scope.url = 'social-stumbleupon';
            } else if ($scope.socialnetwork == 'Tumblr'){
                $scope.url = 'social-tumblr';
            } else if ($scope.socialnetwork == 'Vimeo'){
                $scope.url = 'social-vimeo';
            } else if ($scope.socialnetwork == 'WordPress'){
                $scope.url = 'social-wordpress';
            } else if ($scope.socialnetwork == 'Xing'){
                $scope.url = 'social-xing';
            } else if ($scope.socialnetwork == 'Yahoo'){
                $scope.url = 'social-yahoo';
            } else if ($scope.socialnetwork == 'VK'){
                $scope.url = 'social-vk';
            } else if ($scope.socialnetwork == 'Foursquare'){
                $scope.url = 'social-foursquare';
            } else if ($scope.socialnetwork == 'Flickr'){
                $scope.url = 'social-flickr';
            }
        };

        $scope.addSocialNetwork = function (name,url) {
            var type = '';

            if (name == 'Facebook'){
                type = 'social-facebook';
            } else if (name == 'Twitter'){
                type = 'social-twitter';
            } else if (name == 'LinkedIn'){
                type = 'social-linkedin';
            } else if (name == 'Instagram'){
                type = 'social-instagram';
            } else if (name == 'Reddit'){
                type = 'social-reddit';
            } else if (name == 'Google'){
                type = 'social-google';
            } else if (name == 'YouTube'){
                type = 'social-youtube';
            } else if (name == 'RSS'){
                type = 'social-rss';
            } else if (name == 'Behance'){
                type = 'social-behance';
            } else if (name == 'Dropbox'){
                type = 'social-dropbox';
            } else if (name == 'GitHub'){
                type = 'social-github';
            } else if (name == 'Skype'){
                type = 'social-skype';
            } else if (name == 'Spotify'){
                type = 'social-spotify';
            } else if (name == 'StumbleUpon'){
                type = 'social-stumbleupon';
            } else if (name == 'Tumblr'){
                type = 'social-tumblr';
            } else if (name == 'Vimeo'){
                type = 'social-vimeo';
            } else if (name == 'WordPress'){
                type = 'social-wordpress';
            } else if (name == 'Xing'){
                type = 'social-xing';
            } else if (name == 'Yahoo'){
                type = 'social-yahoo';
            } else if (name == 'VK'){
                type = 'social-vk';
            } else if (name == 'Foursquare'){
                type = 'social-foursquare';
            } else if (name == 'Flickr'){
                type = 'social-flickr';
            }

            RestService.addSocialNetwork(name,url,type);
        };

    }]);