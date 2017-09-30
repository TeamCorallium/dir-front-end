/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('CloseCtrl',["$scope", "$state",
    function ($scope, $state) {

        $scope.closeModal = function() {
            $('#myModal').modal('hide');
            $state.go('home');
        };
    }]);