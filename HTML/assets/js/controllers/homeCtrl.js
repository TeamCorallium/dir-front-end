/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('HomeCtrl', ["$scope", "$state", "$rootScope", "RestService", "$cookies",
    function ($scope, $state, $rootScope, RestService, $cookies) {

        $rootScope.OptionsEdit = true;

        if ($cookies.get('sessionid')) {
            $rootScope.connected = true;
        } else {
            $rootScope.connected = false;
        }

        $rootScope.viewProfile = true;
        $scope.countLimit = 4;
        $scope.profiles = [];
        $scope.tracks = {
            totalVisits: 0,
            returnRatio: 0,
            timeOnSite: 0,
            satisfiedCustomers: 0
        };

        if ($(window).width() >= 992) {
            $scope.countLimit = 4;
        } else if ($(window).width() >= 768) {
            $scope.countLimit = 3;
        } else {
            $scope.countLimit = 1;
        }

        $(window).on("resize.doResize", function () {

            $scope.$apply(function () {
                if ($(window).width() >= 992) {
                    $scope.countLimit = 4;
                } else if ($(window).width() >= 768) {
                    $scope.countLimit = 3;
                } else {
                    $scope.countLimit = 1;
                }
            });
        });

        $scope.$on("$destroy", function () {
            $(window).off("resize.doResize"); //remove the handler added earlier
        });

        $scope.getProfiles = function () {
            RestService.fetchObjectByUrl(RestService.profileDir + '?ordering=-score')
                .then(
                function (data) {
                    $scope.profiles = data.results;

                    for (var i = 0; i < $scope.profiles.length; i++) {
                        if ($scope.profiles[i].avatar != '' && $scope.profiles[i].avatar != null) {
                            var avatarArray = $scope.profiles[i].avatar.split("/");
                            $scope.profiles[i].avatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
                        } else {
                            $scope.profiles[i].avatar = 'assets/images/default-user.png';
                        }
                    }
                },
                function (errResponse) {
                    console.log(errResponse);
                }
                );
        };

        $scope.getProfiles();

        $scope.goToProfile = function (owner) {
            $cookies.remove("exploreUser", { path: '/' });
            $cookies.put('exploreUser', owner, { path: '/' });

            if ($cookies.get('exploreUser') == $cookies.get('username')) {
                $state.go('profile');
            } else {
                $state.go('tshirts');
            }
        };

        $scope.getTracks = function () {
            RestService.fetchTracking().then(
                function (data) {                    
                    data = data.response;

                    $scope.tracks.totalVisits = data.total;
                    $scope.tracks.returnRatio = Math.round(data.return_ratio, 2);
                    $scope.tracks.timeOnSite = data.time_on_site;
                },
                function (errResponse) {
                    console.log(errResponse);
                }
            );
        };

        $scope.getTracks();

    }]);