/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AdminViewCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl",
    function ($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl) {

        $scope.stuff = {
            color: '',
            size: '',
            code: '',
            pin: ''
        };

        $scope.user = [];
        $scope.currentPage = 1;
        $scope.hasNext = '';
        $scope.hasPrevious = '';
        $scope.search = '';

        $scope.addStuff = function () {
            console.log($scope.stuff.color);
            console.log($scope.stuff.size);
            console.log($scope.stuff.code);
            console.log($scope.stuff.pin);
        };

        $scope.getUsers = function (page) {
            RestService.fetchObjectByUrl(RestService.profileDir + '?&search=' + $scope.search + '&page=' + page)
                .then( function (data) {
                    $scope.user = data.results;
                    $scope.hasNext = data.next;
                    $scope.hasPrevious = data.previous;

                    for (var i = 0; i < $scope.user.length; i++) {
                        if ($scope.user[i].avatar != '' && $scope.user[i].avatar != null) {
                            var avatarArray = $scope.user[i].avatar.split("/");
                            $scope.user[i].avatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
                        } else {
                            $scope.user[i].avatar = 'assets/images/default-user.png';
                        }
                    }
                },
                function (errResponse) {
                    console.log(errResponse);
                }
                );
        };

        $scope.getUsers(1);

        $scope.noPrevious = function () {
            return $scope.hasPrevious == null;
        };

        $scope.noNext = function () {
            return $scope.hasNext == null;
        };

        $scope.next = function () {
            if (!$scope.noNext()) {
                $scope.currentPage += 1;
                $scope.getUsers($scope.currentPage);
            }
        };

        $scope.previous = function () {
            if (!$scope.noPrevious()) {
                $scope.currentPage -= 1;
                $scope.getUsers($scope.currentPage);
            }
        };

        $scope.searchUsers = function () {
            $scope.getUsers(1);
        };

    }]);