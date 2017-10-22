/**
 * Created by Ale on 9/7/2017.
 */
'use strict';

var app = angular.module('dirApp',['pulloverDir']);

app.run(['$rootScope','$cookies',
    function ($rootScope, $cookies) {

        $rootScope.viewProfile = true;

        $rootScope.userdata = {
            username: 'USER',
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
            $rootScope.userdata.username = 'USER';
            $rootScope.userdata.connected = false;
        });
    }]);

    app.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });