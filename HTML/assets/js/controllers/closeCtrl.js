/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('CloseCtrl',["$scope", "$state", "$cookies",
    function ($scope, $state, $cookies) {

        $("#myModal").on('hidden.bs.modal', function () {
            if (!$cookies.get('sessionid'))
                $state.go('home');
        });

        $("#myModalLoginHome").on('hidden.bs.modal', function () {
            if (!$cookies.get('sessionid'))
                $state.go('home');
        });

        $("#myModalRegisterHome").on('hidden.bs.modal', function () {
            if (!$cookies.get('sessionid'))
                $state.go('home');
        });
    }]);