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
            }

            RestService.addSocialNetwork(name,url,type);
        };

    }]);