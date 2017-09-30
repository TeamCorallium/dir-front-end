/**
 * Created by Ale on 9/8/2017.
 */
'use strict';

app.controller('ImageDownloadCtrl',["$scope", "$state", "$cookies",
    function ($scope, $state, $cookies) {

        $scope.downloadImage  = function (url) {
        	console.log(url);
			var a = $("<a>").attr("href", url).attr("download", "img.jpg").appendTo("body");

			a[0].click();

			a.remove();
        };
    }]);