/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AddSocialNetworkCtrl',["$rootScope", "$scope", "RestService", "$state", "$cookies",
    function ($rootScope, $scope,RestService, $state, $cookies) {

        $scope.snippets = '';

        $scope.addSocialNetwork = function (name,url) {
            var type = '';

            if (name == 'Facebook'){
                type = 'social-facebook';
            } else if (name == 'Twitter'){
                type = 'social-twitter';
            } else if (name == 'LinkeIn'){
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
            } else if (name == 'DropBox'){
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
            } else if (name == 'FourSquare'){
                type = 'social-foursquare';
            } else if (name == 'Flickr'){
                type = 'social-flickr';
            }

            RestService.addSocialNetwork(name,url,type);
        };

    }]);