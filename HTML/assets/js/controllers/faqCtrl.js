/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('FAQCtrl', ["$scope", "RestService", "$state", "$rootScope", '$cookies',
    function($scope, RestService, $state, $rootScope, $cookies) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", { path: '/' });

        $rootScope.notificationCount = RestService.fetchNotificationUnreaded();

    }
]);