/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('FAQCtrl', ["$scope", "RestService", "$state", "$rootScope", '$cookies',
    function ($scope, RestService, $state, $rootScope, $cookies) {

        if($cookies.get('sessionid')) {
            $rootScope.viewInbox = true;
            $rootScope.viewProfile = true;
        } else {
            $rootScope.viewInbox = false;
            $rootScope.viewProfile = false;
        }


    }]);