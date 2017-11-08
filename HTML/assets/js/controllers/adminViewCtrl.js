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

        $scope.users = [];
        $scope.stocks = [];
        $scope.currentPage = 1;
        $scope.hasNext = '';
        $scope.hasPrevious = '';
        $scope.search = '';        

        $scope.getStocks = function () {
            $scope.stocks = [];
            RestService.fetchStocks()
                .then( function (data) {
                    $scope.stocks = data;
                },
                function (errResponse) {
                    console.log(errResponse);
                }
                );
        };

        $scope.getStocks();

        $scope.addStuff = function () {
            RestService.addStock($scope.stuff.color, $scope.stuff.size, $scope.stuff.code, $scope.stuff.pin);
            $scope.getStocks();
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
            if (e.keyCode == 13) {
                $scope.getUsers(1);
            }
        });

        $scope.deleteUser = function(url) {
            RestService.deleteUser(url);
        };

        $scope.deleteStuff = function(url) {
            RestService.deleteStuff(url);
        };

        $rootScope.$on('deleteUser', function (event, data) {
            $scope.getUsers(1);
        });

        $rootScope.$on('deleteStuff', function (event, data) {
            $scope.getStocks();
        });
    }]);