/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ExploreUsersCtrl', ["$scope", "RestService", "$state", "$rootScope", '$cookies',
    function ($scope, RestService, $state, $rootScope, $cookies) {

        if ($cookies.get('sessionid')) {
            $rootScope.viewInbox = true;
            $rootScope.viewProfile = true;
        } else {
            $rootScope.viewInbox = false;
            $rootScope.viewProfile = false;
        }

        // if ($(window).width() >= 768) {
        //     $scope.applyDateFilter = false;
        //     $scope.applyScoreFilter = false;
        //     $scope.applyRatingFilter = false;
        //     $scope.applyDateFilterMD = false;
        //     $scope.applyScoreFilterMD = true;
        //     $scope.applyRatingFilterMD = false;
        // } else {
        //     $scope.applyDateFilter = false;
        //     $scope.applyScoreFilter = true;
        //     $scope.applyRatingFilter = false;
        //     $scope.applyDateFilterMD = false;
        //     $scope.applyScoreFilterMD = false;
        //     $scope.applyRatingFilterMD = false;
        // }

        // $(window).on("resize.doResize", function () {

        //     $scope.$apply(function () {
        //         if ($(window).width() >= 768) {
        //             $scope.applyDateFilter = false;
        //             $scope.applyScoreFilter = false;
        //             $scope.applyRatingFilter = false;
        //             $scope.applyDateFilterMD = false;
        //             $scope.applyScoreFilterMD = true;
        //             $scope.applyRatingFilterMD = false;
        //         } else {
        //             $scope.applyDateFilter = false;
        //             $scope.applyScoreFilter = true;
        //             $scope.applyRatingFilter = false;
        //             $scope.applyDateFilterMD = false;
        //             $scope.applyScoreFilterMD = false;
        //             $scope.applyRatingFilterMD = false;
        //         }
        //     });
        // });

        $scope.$on("$destroy", function () {
            $(window).off("resize.doResize"); //remove the handler added earlier
        });

        $scope.orderDate = 'AscendingDate';
        $scope.orderScore = 'AscendingScore';
        $scope.orderRating = 'AscendingRating';
        $scope.orderDateMD = 'AscendingDateMD';
        $scope.orderScoreMD = 'AscendingScoreMD';
        $scope.orderRatingMD = 'AscendingRatingMD';
        $scope.applyDateFilter = false;
        $scope.applyScoreFilter = true;
        $scope.applyRatingFilter = false;
        $scope.applyDateFilterMD = false;
        $scope.applyScoreFilterMD = true;
        $scope.applyRatingFilterMD = false;
        $scope.currentPage = 1;
        $scope.hasNext = '';
        $scope.hasPrevious = '';
        $scope.profiles = [];
        $scope.search = '';

        $scope.getProfiles = function (page) {

            var filters = '';

            if ($scope.applyScoreFilter || $scope.applyDateFilter || $scope.applyRatingFilter) {
                filters = '?ordering=';
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
            $cookies.remove("exploreUser", { path: '/' });
            $cookies.put('exploreUser', owner, { path: '/' });
            $state.go('tshirts');
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

    }]);