/**
 * Created by Ale on 9/7/2017.
 */
'use strict';

var app = angular.module('dirApp',['pulloverDir']);

app.run(['$rootScope',
    function ($rootScope) {

        $rootScope.userdata = {
            username: ''
        };

        if($cookies.get('username') != undefined)
            $rootScope.userdata.username = $cookies.get('username');

        $rootScope.$on('connected',function (event, data) {
            $rootScope.userdata.username = $cookies.get('username');
        });

        $rootScope.$on('removeusername',function (event, data) {
            $rootScope.userdata.username = '';
        });
    }]);