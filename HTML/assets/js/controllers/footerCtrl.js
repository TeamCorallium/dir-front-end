app.controller('FooterCtrl', ["$scope", "RestService", "$state", "$rootScope",
    function($scope, RestService, $state, $rootScope) {

        $scope.goToTerms = function() {
            $state.go('terms');
        };

    }
]);