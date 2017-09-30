/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ImageDownloadCtrl',["$scope", "$state", "$cookies",
    function ($scope, $state, $cookies) {

        $scope.downloadImage  = function (url) {
            $('#ImageDownloadCtrl').attr("href",url).attr("download","output.png");
        };
    }]);