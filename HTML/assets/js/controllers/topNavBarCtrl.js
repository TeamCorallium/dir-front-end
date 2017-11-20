/**
 * Created by Ale on 9/14/2017.
 */

'use strict';

app.controller('TopNavBarCtrl', ["$rootScope", "$scope", "$stateParams", "RestService", "$state", "$cookies", "$window", "growl", "SweetAlert", "$translate", "filterFilter",
    function($rootScope, $scope, $stateParams, RestService, $state, $cookies, $window, growl, SweetAlert, $translate, filterFilter) {

        $rootScope.notificationCount = 0;

        if ($cookies.get('username')) {

            $scope.getNotifications = function() {
                RestService.fetchNotification()
                    .then(
                        function(data) {
                            $rootScope.notifications = data.results;

                            for (var i = 0; i < $rootScope.notifications.length; i++) {
                                if ($rootScope.notifications[i].avatar != '' && $rootScope.notifications[i].avatar != null) {
                                    var avatarArray = $rootScope.notifications[i].avatar.split("/");
                                    $rootScope.notifications[i].avatar = RestService.imageDir + avatarArray[avatarArray.length - 1];
                                } else {
                                    $rootScope.notifications[i].avatar = 'assets/images/default-user.png';
                                }
                            }
                        },
                        function(errResponse) {
                            console.log(errResponse);
                        }
                    );
            };

            $scope.getNotifications();

            $scope.getCount = function() {
                $scope.notificationCount = filterFilter($rootScope.notifications, { readed: false }).length;
            };

            $scope.getCount();

        }
    }
]);