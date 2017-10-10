/**
 * Created by Ale on 9/7/2017.
 */
'use strict';

var app = angular.module('dirApp',['pulloverDir']);

app.run(['$rootScope','$cookies',
    function ($rootScope, $cookies) {

        $rootScope.viewProfile = true;

        $rootScope.userdata = {
            username: '',
            connected: false
        };

        if($cookies.get('username') != undefined){
            $rootScope.userdata.username = $cookies.get('username');
            $rootScope.userdata.connected = true;
        }

        $rootScope.$on('connected',function (event, data) {
            $rootScope.userdata.username = $cookies.get('username');
            $rootScope.userdata.connected = true;
        });

        $rootScope.$on('logout',function (event, data) {
            $rootScope.userdata.username = '';
            $rootScope.userdata.connected = false;
        });
    }]);