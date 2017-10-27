/**
 * Created by Ale on 9/7/2017.
 */
'use strict';

var app = angular.module('dirApp', ['pulloverDir']);

app.run(['$rootScope', '$cookies',
    function($rootScope, $cookies) {

        $rootScope.viewProfile = true;
        $rootScope.viewInbox = false;

        $rootScope.userdata = {
            username: 'USER',
            connected: false
        };

        if ($cookies.get('username') != undefined) {
            $rootScope.userdata.username = $cookies.get('username');
            $rootScope.userdata.connected = true;
        }

        $rootScope.$on('connected', function(event, data) {
            $rootScope.userdata.username = $cookies.get('username');
            $rootScope.userdata.connected = true;
        });

        $rootScope.$on('logout', function(event, data) {
            $rootScope.userdata.username = 'USER';
            $rootScope.userdata.connected = false;
        });
    }]);

app.filter('cut', function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

app.controller('FormController', function($scope) { })

app.filter('passwordCount', [function() {
    return function(value, peak) {
        value = angular.isString(value) ? value : '';
        peak = isFinite(peak) ? peak : 7;

        return value && (value.length > peak ? peak + '+' : value.length);
    };
}])

app.factory('zxcvbn', [function() {
    return {
        score: function() {
            var compute = zxcvbn.apply(null, arguments);
            return compute && compute.score;
        }
    };
}])

app.directive('okPassword', ['zxcvbn', function(zxcvbn) {
    return {
        // restrict to only attribute and class
        restrict: 'AC',

        // use the NgModelController
        require: 'ngModel',

        // add the NgModelController as a dependency to your link function
        link: function($scope, $element, $attrs, ngModelCtrl) {
            $element.on('blur change keydown', function(evt) {
                $scope.$evalAsync(function($scope) {
                    // update the $scope.password with the element's value
                    var pwd = $scope.password = $element.val();

                    // resolve password strength score using zxcvbn service
                    $scope.passwordStrength = pwd ? (pwd.length > 7 && zxcvbn.score(pwd) || 0) : null;

                    // define the validity criterion for okPassword constraint
                    ngModelCtrl.$setValidity('okPassword', $scope.passwordStrength >= 2);
                });
            });
        }
    };
}]);

app.directive('pwCheck', [function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function() {
                scope.$apply(function() {
                    // console.info(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);

app.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(4000);
    growlProvider.globalDisableCountDown(true);
}]);