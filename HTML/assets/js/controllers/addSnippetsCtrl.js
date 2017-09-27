/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AddSnippetsCtrl',["$rootScope", "$scope", "RestService", "$state", "$cookies",
    function ($rootScope, $scope,RestService, $state, $cookies) {

    $scope.snippets = '';

    $scope.addSnippets = function (title,body) {
        if($cookies.get('sessionid')!= undefined){
            RestService.addSnippet(title,body);
        } else {
            $('#myModal').modal('show');
        }
    };

    }]);