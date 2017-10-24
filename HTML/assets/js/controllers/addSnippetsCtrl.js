/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AddSnippetsCtrl', ["$rootScope", "$scope", "RestService", "$state", "$cookies", "growl",
    function ($rootScope, $scope, RestService, $state, $cookies, growl) {

        $scope.snippets = '';

        $scope.addSnippets = function (title, body) {
            if (title != '' && body != '') {
                RestService.addSnippet(title, body);
            } else {
                growl.success("Cannot exist empty fields", { title: 'Add Snippet' });
            }
        };

        $rootScope.$on('addSnippetsError', function (event, data) {
            growl.error("Server Not Found. Check your internet connection.", { title: 'Network Connection' });
        });

    }]);