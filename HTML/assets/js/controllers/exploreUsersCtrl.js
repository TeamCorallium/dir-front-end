/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ExploreUsersCtrl',["$scope", "RestService", "$state", "$rootScope",'$cookies',
    function ($scope, RestService, $state, $rootScope, $cookies) {

        $scope.profiles = [];

        $rootScope.viewProfile = true;

        $scope.getProfiles = function () {
            RestService.fetchObjectByUrl(RestService.profileDir)
                .then(
                    function (data) {
                        $scope.profiles = data.results;

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