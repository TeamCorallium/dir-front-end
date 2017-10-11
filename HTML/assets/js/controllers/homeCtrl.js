/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('HomeCtrl',["$scope", "$state", "$rootScope", "RestService", "$cookies",
    function ($scope, $state, $rootScope, RestService, $cookies) {

        $rootScope.viewProfile = true;

        $scope.countLimit = 3;

        if ($(window).width() >= 1200) {
            $scope.countLimit = 3;
        } else if ($(window).width() >=  992) {
            $scope.countLimit = 2
        } else if ($(window).width() >= 768) {
            $scope.countLimit = 2
        } else {
            $scope.countLimit = 1;
        }

        $(window).on("resize.doResize", function (){

            $scope.$apply(function(){
                if ($(window).width() >= 1200) {
                    $scope.countLimit = 3;
                } else if ($(window).width() >=  992) {
                    $scope.countLimit = 2
                } else if ($(window).width() >= 768) {
                    $scope.countLimit = 2
                } else {
                    $scope.countLimit = 1;
                }
            });
        });

        $scope.$on("$destroy",function (){
            $(window).off("resize.doResize"); //remove the handler added earlier
        });

        $scope.profiles = [];

        $scope.getProfiles = function () {
            RestService.fetchObjectByUrl(RestService.profileDir)
                .then(
                    function (data) {
                        $scope.profiles = data;

                        for (var i=0; i<$scope.profiles.length; i++){
                            if ($scope.profiles[i].avatar != '' && $scope.profiles[i].avatar != null){
                                var avatarArray = $scope.profiles[i].avatar.split("/");
                                $scope.profiles[i].avatar = RestService.imageDir+avatarArray[avatarArray.length-1];
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
            $cookies.put('exploreUser',owner,{path: '/'});
            $state.go('tshirts');
        };

    }]);