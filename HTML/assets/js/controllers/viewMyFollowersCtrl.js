/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ViewMyFollowersCtrl', ["$scope", "RestService", "$state", "$rootScope", '$cookies',
    function ($scope, RestService, $state, $rootScope, $cookies) {

        $rootScope.OptionsEdit = false;
        $cookies.remove("exploreUser", {
            path: '/'
        });

        $scope.orderDate = 'AscendingDate';
        $scope.orderScore = 'AscendingScore';
        $scope.orderRating = 'AscendingRating';
        $scope.applyDateFilter = false;
        $scope.applyScoreFilter = true;
        $scope.applyRatingFilter = false;
        $scope.currentPage = 1;
        $scope.hasNext = '';
        $scope.hasPrevious = '';
        $scope.profiles = [];
        $scope.search = '';

        $scope.getProfiles = function (page) {

            var filters = '?';

            if ($scope.applyScoreFilter || $scope.applyDateFilter || $scope.applyRatingFilter) {
                filters += 'ordering=';
                var flag = false;

                if ($scope.applyScoreFilter) {
                    if ($scope.orderScore == 'AscendingScore' || $scope.orderScore == 'AscendingScoreMD') {
                        filters += 'score';
                    } else {
                        filters += '-score';
                    }
                    flag = true;
                }

                if ($scope.applyDateFilter) {
                    if (flag) {
                        filters += ",";
                    }

                    if ($scope.orderDate == 'AscendingDate' || $scope.orderDate == 'AscendingDateMD') {
                        filters += 'created';
                    } else {
                        filters += '-created';
                    }
                    flag = true;
                }

                if ($scope.applyRatingFilter) {
                    if (flag) {
                        filters += ",";
                    }

                    if ($scope.orderRating == 'AscendingRating' || $scope.orderRating == 'AscendingRatingMD') {
                        filters += 'rating';
                    } else {
                        filters += '-rating';
                    }
                }
            }

            filters += '&search=' + $scope.search;

            RestService.fetchObjectByUrl(RestService.profileDir + filters + '&page=' + page)
                .then(
                    function (data) {
                        $scope.profiles = data.results;
                        $scope.hasNext = data.next;
                        $scope.hasPrevious = data.previous;

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

        $scope.getProfiles(1);

        $scope.goToProfile = function (owner) {
            $cookies.remove("exploreUser", {
                path: '/'
            });
            $cookies.put('exploreUser', owner, {
                path: '/'
            });
            if ($cookies.get('exploreUser') == $cookies.get('username')) {
                $state.go('profile');
            } else {
                $state.go('tshirts');
            }
        };

        $scope.changeFiltres = function () {
            $scope.getProfiles(1);
        }

        $scope.noPrevious = function () {
            return $scope.hasPrevious == null;
        };

        $scope.noNext = function () {
            return $scope.hasNext == null;
        };

        $scope.next = function () {
            if (!$scope.noNext()) {
                $scope.currentPage += 1;
                $scope.getProfiles($scope.currentPage);
            }
        };

        $scope.previous = function () {
            if (!$scope.noPrevious()) {
                $scope.currentPage -= 1;
                $scope.getProfiles($scope.currentPage);
            }
        };

        $scope.searchProfile = function () {
            $scope.getProfiles(1);
        };

        $("#searchInput").on('keyup', function (e) {
            if (e.keyCode == 13) {
                $scope.getProfiles(1);
            }
        });

        $scope.changeOrderClapFlagDate = function () {
            if ($(window).width() >= 768) {
                if ($('#DateFilterMD').is(':checked')) {
                    $scope.applyDateFilter = true;
                } else {
                    $scope.applyDateFilter = false;
                }
            } else {
                if ($('#DateFilterXS').is(':checked')) {
                    $scope.applyDateFilter = true;
                } else {
                    $scope.applyDateFilter = false;
                }
            }
        };

        $scope.changeOrderClapFlagScore = function () {
            if ($(window).width() >= 768) {
                if ($('#ScoreFilterMD').is(':checked')) {
                    $scope.applyScoreFilter = true;
                } else {
                    $scope.applyScoreFilter = false;
                }
            } else {
                if ($('#ScoreFilterXS').is(':checked')) {
                    $scope.applyScoreFilter = true;
                } else {
                    $scope.applyScoreFilter = false;
                }
            }
        };

        $scope.changeOrderClapFlagRating = function () {
            if ($(window).width() >= 768) {
                if ($('#RatingFilterMD').is(':checked')) {
                    $scope.applyRatingFilter = true;
                } else {
                    $scope.applyRatingFilter = false;
                }
            } else {
                if ($('#RatingFilterXS').is(':checked')) {
                    $scope.applyRatingFilter = true;
                } else {
                    $scope.applyRatingFilter = false;
                }
            }
        };

    }
]);