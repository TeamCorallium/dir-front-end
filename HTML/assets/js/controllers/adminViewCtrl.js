/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('AdminViewCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl",
    function ($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl) {

        console.log($("#searchUsersInput") + " input");
        
        $scope.stuff = {
            color: '',
            size: '',
            code: '',
            pin: ''
        };

        $scope.users = [];
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
                    $scope.users = data.results;
                    $scope.hasNext = data.next;
                    $scope.hasPrevious = data.previous;

                    for (var i = 0; i < $scope.users.length; i++) {
                        if ($scope.users[i].avatar != '' && $scope.users[i].avatar != null) {
                            var avatarArray = $scope.users[i].avatar.split("/");
                            $scope.users[i].avatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
                        } else {
                            $scope.users[i].avatar = 'assets/images/default-user.png';
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

        $("#searchUsersInput").on('keyup', function (e) {
            console.log($scope.search + " search");
            if (e.keyCode == 13) {
                $scope.getUsers(1);
            }
        });

    }]);