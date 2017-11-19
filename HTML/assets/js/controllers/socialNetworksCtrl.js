/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('SocialNetworksCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert", "$translate",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert, $translate) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", {
            path: '/'
        });

    }
]);