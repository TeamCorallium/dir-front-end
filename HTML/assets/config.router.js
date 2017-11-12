'use strict';

app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRED', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires, $httpProvider) {

        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;

        $httpProvider.defaults.withCredentials = true;

        // LAZY MODULES
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: jsRequires.modules
        });

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('blank', {
            url: '',
            templateUrl: 'views/home.html',
            resolve: loadSequence('homeCtrl')
        }).state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            resolve: loadSequence('homeCtrl')
        }).state('profile', {
            url: '/profile',
            templateUrl: 'views/userProfile.html',
            resolve: loadSequence('userProfileCtrl')
        }).state('tshirts', {
            url: '/tshirts',
            templateUrl: 'views/viewProfile.html',
            resolve: loadSequence('viewProfileCtrl')
        }).state('viewtshirts', {
            url: '/viewtshirts/:id',
            templateUrl: 'views/viewTshirt.html',
            resolve: loadSequence('viewTshirtCtrl')
        }).state('users', {
            url: '/users',
            templateUrl: 'views/exploreUsers.html',
            resolve: loadSequence('exploreUsersCtrl')
        }).state('inbox', {
            url: '/inbox',
            templateUrl: 'views/inbox.html',
            resolve: loadSequence('inboxCtrl')
        }).state('contact', {
            url: '/contact',
            templateUrl: 'views/contactUs.html',
            resolve: loadSequence('contactUsCtrl')
        }).state('faq', {
            url: '/faq',
            templateUrl: 'views/faq.html',
            resolve: loadSequence('faqCtrl')
        }).state('admin', {
            url: '/admin',
            templateUrl: 'views/adminView.html',
            resolve: loadSequence('adminViewCtrl')
        });

        // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
        function loadSequence() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLL, $q) {
                        var promise = $q.when(1);
                        for (var i = 0, len = _args.length; i < len; i++) {
                            promise = promiseThen(_args[i]);
                        }
                        return promise;

                        function promiseThen(_arg) {
                            if (typeof _arg == 'function')
                                return promise.then(_arg);
                            else
                                return promise.then(function () {
                                    var nowLoad = requiredData(_arg);
                                    if (!nowLoad)
                                        return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                    return $ocLL.load(nowLoad);
                                });
                        }

                        function requiredData(name) {
                            if (jsRequires.modules)
                                for (var m in jsRequires.modules)
                                    if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
                                        return jsRequires.modules[m];
                            return jsRequires.scripts && jsRequires.scripts[name];
                        }
                    }
                ]
            };
        }
    }
]);

app.config(["$httpProvider", function ($httpProvider) {

    function buildKey(parentKey, subKey) {
        return parentKey + "[" + subKey + "]";
    }

    function buildObject(key, value) {
        var object = {};
        object[key] = value;
        return object;
    }

    function join(array) {
        return array.filter(function (entry) {
            return entry;
        }).join("&");
    }

    function arrayToQueryString(parentKey, array) {
        return join(array.map(function (value, subKey) {
            return toQueryString(buildObject(buildKey(parentKey, subKey), value));
        }));
    }

    function objectToQueryString(parentKey, object) {
        return join(Object.keys(object).map(function (subKey) {
            return toQueryString(buildObject(buildKey(parentKey, subKey), object[subKey]));
        }));
    }

    function toQueryString(input) {
        return join(Object.keys(input).map(function (key) {
            var value = input[key];
            if (value instanceof Array) {
                return arrayToQueryString(key, value);
            } else if (value instanceof Object) {
                return objectToQueryString(key, value);
            } else if (undefined !== value && null !== value) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            } else {
                return "";
            }
        }));
    }

    function isQueryStringEligible(input) {
        return null !== input && "object" === typeof input && "[object File]" !== String(input);
    }

    var interceptor = [function () {
        return {
            request: function (config) {
                if (0 <= ["post", "put", "patch"].indexOf(config.method.toLowerCase()) && isQueryStringEligible(config.data)) {
                    config.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
                    config.data = toQueryString(config.data);
                }
                return config;
            }
        };
    }];

    // $httpProvider.interceptors.push(interceptor);

}]);